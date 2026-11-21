<template>
  <div class="landing-page">
    <main>
      <section class="hero">
        <div class="hero-copy">
          <div class="eyebrow">
            <span aria-hidden="true">✦</span>
            <span>YOUR NEXT CHAPTER STARTS HERE</span>
          </div>
          <h1>Your experience deserves a better resume.</h1>
          <p class="hero-description">
            Turn what you’ve done into what’s next. Build a job-ready resume with expert guidance,
            beautiful templates, and a little help from AI.
          </p>
          <a class="hero-primary" href="#preview">See how it works</a>
          <p class="hero-note">No credit card needed · Your first resume is on us</p>
        </div>

        <div class="hero-preview" id="preview">
          <div class="preview-window">
            <div class="preview-topbar">
              <span class="preview-document-name">folio / My first resume</span>
              <span class="saved">✓ All changes saved</span>
            </div>
            <div class="preview-body">
              <aside class="preview-sidebar">
                <div class="sidebar-heading">YOUR RESUME</div>
                <div class="sidebar-item active">
                  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <circle cx="12" cy="8" r="4" />
                    <path d="M5 21v-2a7 7 0 0 1 14 0v2" />
                  </svg>
                  <span>Personal details</span>
                </div>
                <div class="sidebar-item">
                  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <rect x="3" y="7" width="18" height="14" rx="2" />
                    <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m-13 5h18m-11 0v2h4v-2" />
                  </svg>
                  <span>Experience</span>
                </div>
                <div class="sidebar-item">
                  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M12 5v14m-7-7h14" />
                  </svg>
                  <span>Education</span>
                </div>
                <div class="sidebar-item">
                  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M12 3v3m0 12v3M3 12h3m12 0h3M5.64 5.64l2.12 2.12m8.48 8.48 2.12 2.12m0-12.72-2.12 2.12m-8.48 8.48-2.12 2.12" />
                    <path d="m12 8 1.15 2.85L16 12l-2.85 1.15L12 16l-1.15-2.85L8 12l2.85-1.15L12 8Z" />
                  </svg>
                  <span>Skills</span>
                </div>
              </aside>
              <article class="resume-card">
                <h2>ALEX MORGAN</h2>
                <p class="resume-title">PRODUCT DESIGNER</p>
                <p class="resume-contact">San Francisco, CA&nbsp; · &nbsp;alex.morgan@email.com</p>
                <div class="resume-section">
                  <h3>PROFILE</h3>
                  <p>Thoughtful product designer creating clear, human experiences. Bringing curiosity, craft, and 5+ years of turning complex problems into simple solutions.</p>
                </div>
                <div class="resume-section">
                  <h3>EXPERIENCE</h3>
                  <h4>Senior Product Designer · Studio Labs</h4>
                  <p class="resume-meta">2022 – Present&nbsp; | &nbsp;San Francisco, CA</p>
                  <p>Led end-to-end design for a platform serving 40,000+ users. Partnered with engineering to improve onboarding completion by 32%.</p>
                </div>
                <div class="resume-section">
                  <h3>EDUCATION</h3>
                  <h4>BFA, Interaction Design · California College of the Arts</h4>
                </div>
              </article>
              <aside class="coach-card">
                <span class="coach-orb" aria-hidden="true">✦</span>
                <p class="coach-heading">Looking good, Alex.</p>
                <p class="coach-subtitle">Your story is taking shape.</p>
                <div class="strength-score">
                  <p class="score-value">92 / 100</p>
                  <p class="score-label">Resume strength</p>
                </div>
                <p class="coach-tip-title">Make every word count</p>
                <p class="coach-tip">
                  Use action verbs to show the impact you made, not just the work you did.
                </p>
              </aside>
            </div>
          </div>
        </div>
      </section>

      <section class="how-section" id="how-it-works">
        <h2>Less formatting. More possibilities.</h2>
        <p class="section-subtitle">From blank page to ready to apply, in three simple steps.</p>
        <div class="steps">
          <article>
            <div class="step-top">
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="m5 12.5 4.2 4.2L19 7" />
              </svg>
              <span>01</span>
            </div>
            <h3>Choose your look</h3>
            <p>Start with a clean, recruiter-friendly layout that puts your experience first.</p>
          </article>
          <article>
            <div class="step-top">
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M12 3v3m0 12v3M3 12h3m12 0h3M5.64 5.64l2.12 2.12m8.48 8.48 2.12 2.12m0-12.72-2.12 2.12m-8.48 8.48-2.12 2.12" />
                <path d="m12 8 1.15 2.85L16 12l-2.85 1.15L12 16l-1.15-2.85L8 12l2.85-1.15L12 8Z" />
              </svg>
              <span>02</span>
            </div>
            <h3>Tell your story</h3>
            <p>Get past the blank page with helpful prompts and AI-powered writing guidance.</p>
          </article>
          <article>
            <div class="step-top">
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M12 3v12m0 0 4-4m-4 4-4-4M5 17v3h14v-3" />
              </svg>
              <span>03</span>
            </div>
            <h3>Make your next move</h3>
            <p>Download a polished PDF and head into your next application with confidence.</p>
          </article>
        </div>
      </section>

      <section class="closing">
        <h2>Your next opportunity starts with you.</h2>
        <p>Let’s make a resume that opens the right doors.</p>
        <RouterLink to="/create-resume">A better resume. A brighter next chapter.</RouterLink>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'LandingPage' })
</script>

<style src="../assets/landing.css"></style>
