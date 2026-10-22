// Teaching snippets: imports and application-specific collaborators are omitted.
// Version-specific requirements are stated with each example.
const javaExamples = {
1: ['Equal keys replace values', `record Key(String value) {
    @Override public int hashCode() { return 7; }
}

var map = new HashMap<Key, String>();
map.put(new Key("A"), "first");
map.put(new Key("B"), "second"); // Same hash, unequal key
map.put(new Key("A"), "updated");
System.out.println(map.size()); // 2
System.out.println(map.get(new Key("A"))); // updated`, 'A collision alone does not overwrite an entry: equals distinguishes keys in the bucket. A constant hash is deliberate here to demonstrate collisions; do not use it in production. Records require Java 16+.'],
2: ['Keep equality fields stable', `// Keep mutable status out of the key's equality fields.
record SafeOrderKey(long tenantId, long orderId) {}

Map<SafeOrderKey, String> cache = new HashMap<>();
cache.put(new SafeOrderKey(12, 99), "PAID");
String status = cache.get(new SafeOrderKey(12, 99));
// Keep mutable order status in the value, not the key.`, 'A record of primitive identifiers is a stable value key. Records containing mutable objects still need care: record syntax does not make those objects immutable. Java 16+.'],
3: ['Copy mutable input and output', `public final class Schedule {
    private final Date start;

    public Schedule(Date start) {
        this.start = new Date(start.getTime());
    }

    public Date start() {
        return new Date(start.getTime());
    }
}`, 'Both copies matter: one prevents the caller mutating the original constructor argument, and the other prevents mutation through the getter. Prefer immutable Instant in a new API.'],
4: ['Build complete, immutable cache keys', `record PriceKey(
    long tenantId,
    String productId,
    Currency currency,
    int pricingVersion
) {}

Map<PriceKey, BigDecimal> prices = new HashMap<>();`, 'Generated record equality includes every component. This prevents one tenant, currency, or pricing version from reusing another result. Persistence entity equality needs a separate lifecycle-aware policy. Java 16+.'],
5: ['Producer extends, consumer super', `static <T> void copy(
        List<? extends T> source,
        List<? super T> target) {
    for (T item : source) {
        target.add(item);
    }
}

List<Integer> source = List.of(1, 2, 3);
List<Number> target = new ArrayList<>();
copy(source, target);`, 'The source produces values assignable to T; the destination accepts them. You cannot safely add an arbitrary Number to List<? extends Number>. List.of requires Java 9+.'],
6: ['Reduce without shared mutation', `int total = values.stream()
    .filter(value -> value > 0)
    .mapToInt(Integer::intValue)
    .sum();

// Avoid: parallel workers mutate the same ArrayList.
// values.parallelStream().forEach(sharedList::add);`, 'sum supplies an appropriate reduction. Shared side effects can race and make a parallel pipeline slower or incorrect. Parallelism is a measured decision, not an automatic upgrade.'],
7: ['Map an application error at the HTTP boundary', `@RestControllerAdvice
class ApiErrors {
    @ExceptionHandler(OrderNotFound.class)
    ResponseEntity<ProblemDetail> missing(OrderNotFound ex) {
        var problem = ProblemDetail.forStatusAndDetail(
            HttpStatus.NOT_FOUND, "Order not found");
        return ResponseEntity.status(404).body(problem);
    }
}`, 'The client receives a stable application-level response without SQL or internal stack traces. OrderNotFound is an application exception. ProblemDetail is available in Spring Framework 6+.'],
11: ['Publish data through a volatile flag', `class ResultHolder {
    private int result;
    private volatile boolean ready;

    void publish() {
        result = 42;
        ready = true;
    }

    OptionalInt read() {
        return ready ? OptionalInt.of(result)
                     : OptionalInt.empty();
    }
}`, 'For this one-shot publication, observing ready=true establishes visibility of the preceding result write. This is not a reusable multi-producer protocol; later concurrent updates need their own coordination.'],
12: ['Make a compound increment atomic', `private final AtomicInteger requests = new AtomicInteger();

int recordRequest() {
    return requests.incrementAndGet();
}

// volatile int count; count++ is still a race:
// read count -> add one -> write count.`, 'incrementAndGet is one atomic read-modify-write operation. It does not make an invariant spanning several independent atomic variables transactional.'],
13: ['Bound lock acquisition time', `boolean update() throws InterruptedException {
    if (!lock.tryLock(100, TimeUnit.MILLISECONDS)) {
        return false; // Caller decides overload handling.
    }
    try {
        updateLocalState();
        return true;
    } finally {
        lock.unlock();
    }
}`, 'lock is a shared ReentrantLock. Only unlock after successful acquisition, and always release in finally. InterruptedException propagates rather than silently discarding cancellation.'],
14: ['Express the whole per-key update', `ConcurrentHashMap<String, Integer> counts =
    new ConcurrentHashMap<>();

counts.merge("checkout", 1, Integer::sum);

// Not atomic as a compound operation:
// counts.put("checkout", counts.getOrDefault("checkout", 0) + 1);`, 'merge performs the count update atomically for this key. Transferring values between two keys requires a wider invariant boundary. Keep remapping functions short and side-effect-free.'],
15: ['Bound the executor and its queue', `ExecutorService workers = new ThreadPoolExecutor(
    8, 8,
    0L, TimeUnit.MILLISECONDS,
    new ArrayBlockingQueue<>(100),
    new ThreadPoolExecutor.AbortPolicy()
);

// On saturation, submit/execute can reject immediately.
// At application shutdown: workers.shutdown();`, 'The numbers are illustrative, not a sizing recommendation. Translate rejection into deliberate overload behavior and monitor queue wait. Never shut down a shared application executor after each request.'],
16: ['Compose instead of blocking on child work', `CompletableFuture<User> user =
    CompletableFuture.supplyAsync(() -> loadUser(id), ioPool);
CompletableFuture<Cart> cart =
    CompletableFuture.supplyAsync(() -> loadCart(id), ioPool);

CompletableFuture<Quote> quote = user
    .thenCombine(cart, this::buildQuote)
    .orTimeout(800, TimeUnit.MILLISECONDS);`, 'Use a bounded, application-managed ioPool and configure deadlines in the underlying clients. orTimeout completes the future exceptionally; it does not guarantee cancellation of the two I/O operations. Java 9+.'],
17: ['Avoid blocking an executor on its own children', `// Fragile with a small fixed pool:
// pool.submit(() -> pool.submit(this::load).get());

CompletableFuture<Result> result =
    CompletableFuture.supplyAsync(this::load, pool)
        .thenApply(this::transform);`, 'Composition avoids occupying an extra worker just to wait for queued child work. transform should be short; use an appropriate explicit executor if the next stage blocks.'],
18: ['One virtual thread per task', `// Java 21+
try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
    List<Future<String>> calls = new ArrayList<>();
    for (URI uri : uris) {
        calls.add(executor.submit(() -> fetch(uri)));
    }
    for (Future<String> call : calls) {
        System.out.println(call.get());
    }
}`, 'This bounded batch waits for completion when the executor closes. fetch must still have network deadlines, and the input batch or scarce resource usage needs limits. Virtual threads do not make CPU work faster.'],
19: ['Clean up thread-bound context', `private static final ThreadLocal<String> TENANT =
    new ThreadLocal<>();

void handle(String tenantId) {
    TENANT.set(tenantId);
    try {
        processRequest();
    } finally {
        TENANT.remove();
    }
}`, 'This example assumes an outer request boundary with no pre-existing tenant binding. For nested bindings, restore the previous context. Executor handoffs require explicit propagation; ThreadLocal does not follow a request automatically.'],
20: ['Limit in-flight dependency calls', `private final Semaphore permits = new Semaphore(20);

Response callDependency() throws InterruptedException {
    if (!permits.tryAcquire(50, TimeUnit.MILLISECONDS)) {
        throw new RejectedExecutionException("Dependency busy");
    }
    try {
        return client.call(); // Configure its own deadline.
    } finally {
        permits.release();
    }
}`, 'Acquire before doing the work and release only after successful acquisition. The limit is per application instance; multiple replicas need a deliberate aggregate capacity budget.'],
21: ['Run startup work after bean initialization', `@Component
class CatalogWarmup implements ApplicationRunner {
    private final CatalogService catalog;

    CatalogWarmup(CatalogService catalog) {
        this.catalog = catalog;
    }

    @Override
    public void run(ApplicationArguments args) {
        catalog.loadRequiredReferenceData();
    }
}`, 'The injected service is initialized before the runner executes. Runners still delay readiness, so required work should have a deadline and optional warmup should not hold startup indefinitely.'],
22: ['Make a default bean back off', `@AutoConfiguration
class PricingAutoConfiguration {
    @Bean
    @ConditionalOnMissingBean(PricingService.class)
    PricingService pricingService() {
        return new DefaultPricingService();
    }
}`, 'For a modern Boot library, register this configuration in META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports. This is a fragment of auto-configuration, not a complete library. A user-defined PricingService causes this default to back off.'],
23: ['Qualify a dependency by business meaning', `@Service
class CheckoutService {
    private final PaymentGateway gateway;

    CheckoutService(
            @Qualifier("europePayments") PaymentGateway gateway) {
        this.gateway = gateway;
    }
}`, 'The application must define a PaymentGateway bean with the matching qualifier. Constructor injection makes the dependency explicit and avoids relying on incidental parameter names.'],
24: ['Keep lifecycle initialization local', `@Component
class LocalIndex {
    private Map<String, String> index;

    @PostConstruct
    void initialize() {
        index = Map.of("default", "standard");
    }

    String lookup(String key) {
        return index.get(key);
    }
}`, 'In modern Spring, PostConstruct comes from jakarta.annotation. Keep this callback simple: it executes during bean initialization, so invoking transactional logic on this is not a reliable proxy boundary.'],
25: ['Cross a collaborator proxy', `@Service
class CheckoutService {
    private final ReservationService reservations;

    CheckoutService(ReservationService reservations) {
        this.reservations = reservations;
    }

    void checkout() { reservations.reserve(); }
}

@Service
class ReservationService {
    @Transactional
    public void reserve() { /* Database work */ }
}`, 'The call crosses an injected collaborator proxy, allowing transactional advice to run. Transaction management and a suitable transaction manager must be configured. Calling this.reserve() within the same target would bypass ordinary proxy advice.'],
26: ['Keep request data out of singleton fields', `@Service
class ReceiptService {
    private final ReceiptRepository repository;

    ReceiptService(ReceiptRepository repository) {
        this.repository = repository;
    }

    Receipt create(String customerId) {
        return repository.save(new Receipt(customerId));
    }
}`, 'customerId is local to each invocation instead of a shared currentCustomer field. The repository and Receipt types are application-specific. Stateless structure helps, but database invariants still need transactional protection.'],
28: ['Bind and validate related settings', `@ConfigurationProperties("payments")
@Validated
public record PaymentSettings(
    @NotNull URI baseUrl,
    @NotNull Duration timeout,
    @Min(1) int maxConcurrent
) {}`, 'Enable binding with @ConfigurationPropertiesScan or @EnableConfigurationProperties, and include a validation provider. Add a custom constraint for a positive bounded timeout; @NotNull alone does not validate its range. Records require Java 16+.'],
29: ['Offload a blocking bridge deliberately', `Mono<Order> findOrder(long id) {
    return Mono.fromCallable(() -> blockingService.findDto(id))
        .subscribeOn(Schedulers.boundedElastic());
}`, 'This is a Reactor/WebFlux bridge, not a nonblocking database driver. The imperative service should complete its transaction and DTO mapping before returning. Bound downstream concurrency and avoid JDBC on event-loop threads.'],
31: ['Declare rollback for a checked failure', `@Transactional(rollbackFor = InventoryUnavailable.class)
public void placeOrder(Order order)
        throws InventoryUnavailable {
    inventory.reserve(order);
    orders.save(order);
}`, 'InventoryUnavailable is a checked application exception in this example. It must escape the advised method for this rollback rule to apply. Local rollback does not reverse remote side effects.'],
32: ['Isolate work with an independent transaction', `@Service
class AuditService {
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void recordFailure(String operationId) {
        auditRepository.save(new AuditEntry(operationId));
    }
}`, 'Another bean must call this injected service through its proxy. Its transaction can commit even when the caller rolls back; that is a deliberate business choice. Budget the extra connection and avoid recording an uncommitted operation as successful.'],
34: ['Detect conflicting entity updates', `@Entity
class Product {
    @Id
    private Long id;

    @Version
    private long version;

    private int stock;
}`, 'Hibernate adds version checking to managed updates. A concurrent version change causes an optimistic locking failure; decide whether to return a conflict or retry the entire business operation safely. This is an entity fragment with accessors omitted.'],
35: ['Fetch an association for a specific use case', `interface OrderRepository extends JpaRepository<Order, Long> {
    @EntityGraph(attributePaths = "customer")
    List<Order> findByStatus(OrderStatus status);
}`, 'The graph declares the customer fetch plan for this repository method. It does not mean all collection relationships should become eager. Verify the generated SQL and query count with a representative dataset.'],
36: ['Project exactly the fields an endpoint needs', `public record OrderSummary(Long id, String customerName) {}

@Query("""
    select new com.example.OrderSummary(o.id, c.name)
    from Order o join o.customer c
    where o.status = :status
    """)
List<OrderSummary> summaries(@Param("status") OrderStatus status);`, 'Place this method in a Spring Data JPA repository and the public DTO in its matching package/file. The projection avoids loading an entity graph just for response fields. Use real mappings and inspect the query plan. Text blocks require Java 15+.'],
37: ['Flush before detaching a batch', `for (int i = 0; i < records.size(); i++) {
    entityManager.persist(records.get(i));
    if ((i + 1) % 50 == 0) {
        entityManager.flush();
        entityManager.clear();
    }
}
entityManager.flush();
entityManager.clear();`, 'Execute inside an appropriate transaction. flush sends SQL without committing; clear detaches managed entities. The input list is only an illustrative finite batch—stream or chunk large inputs, and use shorter transactions for restartability.'],
38: ['Commit work in restartable chunks', `// Orchestrator is outside the chunk transaction.
while (true) {
    ChunkResult result = chunkService.processNext(checkpoint, 500);
    if (result.processed() == 0) break;
    checkpoint = result.lastId();
}

// processNext runs on an injected transactional collaborator.
// Persist output and its durable checkpoint in that transaction.`, 'The cursor in memory is not a recovery guarantee. Read a durable checkpoint after restart, use stable keyset ordering, and make output idempotent. The loop is an orchestration fragment, not a full batch framework.'],
39: ['Commit the business change and outbox together', `@Transactional
public void place(Order order) {
    orders.save(order);
    outbox.save(new OutboxEvent(
        UUID.randomUUID(), order.id(), "OrderPlaced"));
}`, 'Both repositories must participate in the same local database transaction. A separate durable relay publishes the event and tracks delivery; duplicates are still possible, so consumers need idempotency. This is the write side of the pattern.'],
41: ['Claim an idempotency key atomically', `@Transactional
public PaymentResult pay(String key, PaymentRequest request) {
    var existing = attempts.findByKey(key);
    if (existing.isPresent()) {
        return verifyPayloadAndRead(existing.get(), request);
    }
    attempts.insertClaim(key, fingerprint(request));
    return completeLocalPayment(key, request);
}`, 'The database MUST enforce uniqueness on the scoped key; the initial lookup does not prevent races. Handle a duplicate claim outside the failed transaction, then read the winner in a fresh transaction. Remote payments additionally need provider idempotency and recovery states; this sketch covers local atomic work only.'],
42: ['Retry the whole safe transaction', `RetryTemplate retries = RetryTemplate.builder()
    .maxAttempts(3)
    .exponentialBackoff(50, 2.0, 200)
    .retryOn(CannotAcquireLockException.class)
    .build();

retries.execute(context -> orderService.updateInNewTransaction(id));`, 'This uses Spring Retry 2.x, not Spring Framework 7’s core RetryTemplate. The injected collaborator must start a fresh transaction per attempt, and the operation must be safe to repeat. This example has bounded backoff but no jitter; add jitter in a production policy and respect the overall deadline.'],
44: ['Cache a stable business lookup', `@Cacheable(cacheNames = "products", key = "#id", sync = true)
public ProductView findProduct(long id) {
    return repository.findView(id);
}`, 'Calls must cross the Spring cache proxy. sync asks the provider to coordinate loading; it is not a universal cross-replica lock. Configure cache bounds and expiry in the provider, and design invalidation separately.'],
45: ['Enforce both scope and resource ownership', `@PreAuthorize("hasAuthority('SCOPE_orders:read')")
public OrderView read(long orderId, Authentication caller) {
    Order order = repository.findRequired(orderId);
    if (!order.ownerSubject().equals(caller.getName())) {
        throw new AccessDeniedException("Forbidden");
    }
    return mapper.toView(order);
}`, 'Enable method security, validate the JWT in the resource-server configuration, and enforce tenant boundaries too. This example supplements token validation with object-level authorization; possession of a scope does not imply ownership of every order.'],
48: ['Test a business rule without a Spring context', `@Test
void rejectsNegativeQuantity() {
    assertThrows(IllegalArgumentException.class,
        () -> new OrderLine("SKU-1", -1));
}`, 'JUnit Jupiter is used here; OrderLine is an application type whose constructor enforces the rule. Keep this test fast, then separately exercise persistence constraints and endpoint behavior in the appropriate integration or slice tests.'],
49: ['Observe a real committed transaction', `TransactionTemplate tx = new TransactionTemplate(txManager);

Long id = tx.execute(status -> {
    Order order = repository.save(new Order("SKU-1"));
    return order.getId();
});

assertTrue(repository.findById(id).isPresent());`, 'Run outside a test-managed rollback transaction and against the intended database engine. The callback commits on success. Clean up committed fixtures explicitly; use separate connections and deterministic barriers for concurrency tests.']
};
