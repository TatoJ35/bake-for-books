// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('is-open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

// Close the mobile menu once a link is used
navLinks.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// Fade sections in as they scroll into view
const revealEls = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealEls.forEach((el) => observer.observe(el));
} else {
  // Fallback for old browsers: just show everything
  revealEls.forEach((el) => el.classList.add('is-visible'));
}

// Bake sale photo carousel
const photoTrack = document.querySelector('.photo-track');

if (photoTrack) {
  const photoItems = Array.from(photoTrack.querySelectorAll('.photo-item'));
  const prevArrow = document.querySelector('.carousel-arrow-prev');
  const nextArrow = document.querySelector('.carousel-arrow-next');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let isHoveringTrack = false;
  let arrowPauseUntil = 0;

  const pauseForArrow = () => {
    arrowPauseUntil = Date.now() + 3000;
  };

  const scrollByOnePhoto = (direction) => {
    const item = photoItems[0];
    const step = item ? item.getBoundingClientRect().width + 18 : photoTrack.clientWidth;
    photoTrack.scrollBy({ left: direction * step, behavior: 'smooth' });
    pauseForArrow();
  };

  prevArrow?.addEventListener('click', () => scrollByOnePhoto(-1));
  nextArrow?.addEventListener('click', () => scrollByOnePhoto(1));

  photoTrack.addEventListener('mouseenter', () => { isHoveringTrack = true; });
  photoTrack.addEventListener('mouseleave', () => { isHoveringTrack = false; });

  photoItems.forEach((item) => {
    item.addEventListener('mouseenter', () => {
      item.classList.add('is-hovered');
      photoItems.forEach((other) => {
        if (other !== item) other.classList.add('is-dimmed');
      });
    });
    item.addEventListener('mouseleave', () => {
      item.classList.remove('is-hovered');
      photoItems.forEach((other) => other.classList.remove('is-dimmed'));
    });
  });

  if (!prefersReducedMotion) {
    const AUTO_SCROLL_SPEED = 0.5; // pixels per animation frame

    const tick = () => {
      const isPausedForArrow = Date.now() < arrowPauseUntil;

      if (!isHoveringTrack && !isPausedForArrow) {
        const maxScroll = photoTrack.scrollWidth - photoTrack.clientWidth;

        if (photoTrack.scrollLeft >= maxScroll - 1) {
          photoTrack.scrollLeft = 0;
        } else {
          photoTrack.scrollLeft += AUTO_SCROLL_SPEED;
        }
      }

      requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }
}

// Donation progress tracker
const donationBarBleed = document.querySelector('.progress-bar-bleed');

if (donationBarBleed && typeof DONATIONS_DATA !== 'undefined') {
  const goal = DONATIONS_DATA.goal;
  const entries = DONATIONS_DATA.entries;

  const totalsBySource = entries.reduce((totals, entry) => {
    totals[entry.source] = (totals[entry.source] || 0) + entry.amount;
    return totals;
  }, {});

  const bakeSaleTotal = totalsBySource['bake-sale'] || 0;
  const donationOnlyTotal = totalsBySource['donation'] || 0;
  const grandTotal = bakeSaleTotal + donationOnlyTotal;

  const bakeSalePercent = Math.min(100, (bakeSaleTotal / goal) * 100);
  const donationPercent = Math.min(100, (donationOnlyTotal / goal) * 100);

  const totalEl = document.getElementById('donationTotal');
  const goalEl = document.getElementById('donationGoal');
  if (totalEl) totalEl.textContent = grandTotal.toLocaleString();
  if (goalEl) goalEl.textContent = goal.toLocaleString();

  const tooltipEl = document.getElementById('donationTooltip');
  if (tooltipEl) {
    tooltipEl.textContent = `$${bakeSaleTotal} from bake sales, $${donationOnlyTotal} from donations`;
  }

  // Build the donation feed, newest first
  const feedEl = document.getElementById('donationFeed');
  if (feedEl && entries.length === 0) {
    const empty = document.createElement('li');
    empty.className = 'donation-feed-empty';
    empty.textContent = 'No donations logged yet — the first one could be yours.';
    feedEl.appendChild(empty);
  } else if (feedEl) {
    const sortedEntries = [...entries].sort((a, b) => new Date(b.date) - new Date(a.date));

    sortedEntries.forEach((entry) => {
      const item = document.createElement('li');
      item.className = 'donation-entry';

      const dot = document.createElement('span');
      dot.className = `donation-entry-dot donation-entry-dot-${entry.source}`;

      const info = document.createElement('div');
      info.className = 'donation-entry-info';

      const label = document.createElement('span');
      label.className = 'donation-entry-label';
      label.textContent = entry.label;

      const date = document.createElement('span');
      date.className = 'donation-entry-date';
      date.textContent = new Date(entry.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });

      info.append(label, date);

      const amount = document.createElement('span');
      amount.className = 'donation-entry-amount';
      amount.textContent = `$${entry.amount}`;

      item.append(dot, info, amount);
      feedEl.appendChild(item);
    });

    if (sortedEntries.length > 5) {
      feedEl.classList.add('is-scrollable');
    }
  }

  // Bar fill + milestone pop, animated once the tracker scrolls into view
  const bakeSaleSegment = document.getElementById('segmentBakeSale');
  const donationSegment = document.getElementById('segmentDonation');
  const milestoneEls = Array.from(donationBarBleed.querySelectorAll('.donation-milestone'));
  const prefersReducedMotionBar = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const setMilestoneStates = (amountSoFar) => {
    milestoneEls.forEach((el) => {
      const threshold = Number(el.dataset.milestone);
      el.classList.toggle('is-reached', amountSoFar >= threshold);
    });
  };

  const setBarProgress = (progress) => {
    if (bakeSaleSegment) bakeSaleSegment.style.width = `${bakeSalePercent * progress}%`;
    if (donationSegment) donationSegment.style.width = `${donationPercent * progress}%`;
    setMilestoneStates(grandTotal * progress);
  };

  if (prefersReducedMotionBar) {
    setBarProgress(1);
  } else {
    setBarProgress(0);

    const animateBar = () => {
      const duration = 1200;
      const start = performance.now();

      const step = (now) => {
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
        setBarProgress(eased);
        if (t < 1) requestAnimationFrame(step);
      };

      requestAnimationFrame(step);
    };

    if ('IntersectionObserver' in window) {
      const barObserver = new IntersectionObserver(
        (barEntries) => {
          barEntries.forEach((barEntry) => {
            if (barEntry.isIntersecting) {
              animateBar();
              barObserver.unobserve(barEntry.target);
            }
          });
        },
        { threshold: 0.3 }
      );
      barObserver.observe(donationBarBleed);
    } else {
      animateBar();
    }
  }
}
