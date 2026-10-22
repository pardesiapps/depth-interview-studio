// Replace only with the new owner's information. Keep sensitive identifiers out.
window.DepthProfile = {
  name: 'Your Name',
  email: 'you@example.com',
  linkedin: 'https://www.linkedin.com/in/your-profile/',
  title: 'Java & Spring Boot Practice',
  experienceLabel: 'INTERVIEW PRACTICE',
  employer: { email: 'contact@example.com', company: 'Example Company', address: ['Street address', 'City, Region Postal code'], phone: '+1 555 010 0100', website: 'https://www.example.com/' },
  resume: null, // Example: { path: 'assets/resume.pdf', filename: 'resume.pdf', format: 'PDF' }
  outreach: {
    subject: 'Exploring [Role] Opportunities — Your Name',
    greeting: 'Hi [Recruiter/Hiring Manager Name],',
    paragraphs: [
      'I’m Your Name, a [role] with [experience] specializing in [skills]. I’m reaching out to explore opportunities at [Company Name].',
      'I’ve attached my résumé for your review and would welcome a conversation about suitable openings. Thank you for your time.'
    ],
    signature: ['Best regards,', 'Your Name', 'Email: you@example.com', 'LinkedIn: https://www.linkedin.com/in/your-profile/']
  }
};
