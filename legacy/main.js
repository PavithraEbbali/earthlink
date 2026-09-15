/* =========================================================================
   EarthLink Authorized Retailer — interaction & animation layer
   Progressive enhancement: every effect is optional. If GSAP fails to
   load or JS is blocked, all content stays visible and usable.
   Animation vocabulary covered:
     • Scroll reveal (IntersectionObserver + GSAP ScrollTrigger)
     • Native anchor scrolling            • Mouse-move parallax
     • 3D tilt cards (perspective)       • Magnetic buttons (spring feel)
     • Spotlight cursor cards            • Number counters + bar fills
     • Word-by-word typographic reveal   • Icon / hover micro-motion (CSS)
   ========================================================================= */
(function () {
  "use strict";

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(pointer: fine)").matches;
  var hasGSAP = typeof window.gsap !== "undefined";
  var hasST = hasGSAP && typeof window.ScrollTrigger !== "undefined";
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var raf = window.requestAnimationFrame || function (cb) { return setTimeout(cb, 16); };

  /* ---------- 0. Year stamp ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- 1. Typographic word reveal ---------- */
  // Rebuild flagged headlines into .word > span units for a clip-rise reveal.
  $$("[data-reveal-words]").forEach(function (el) {
    var frag = document.createDocumentFragment();
    Array.prototype.forEach.call(el.childNodes, function (node) {
      if (node.nodeType === 3) {
        // text node -> split into words
        node.textContent.split(/(\s+)/).forEach(function (chunk) {
          if (/^\s+$/.test(chunk)) { frag.appendChild(document.createTextNode(" ")); }
          else if (chunk.length) { frag.appendChild(makeWord(chunk, null)); }
        });
      } else if (node.nodeType === 1) {
        // element (e.g. gradient span) -> keep its class, split its words
        var cls = node.getAttribute("class");
        node.textContent.split(/(\s+)/).forEach(function (chunk) {
          if (/^\s+$/.test(chunk)) { frag.appendChild(document.createTextNode(" ")); }
          else if (chunk.length) { frag.appendChild(makeWord(chunk, cls)); }
        });
      }
    });
    el.innerHTML = "";
    el.appendChild(frag);
  });
  function makeWord(text, innerClass) {
    var outer = document.createElement("span");
    outer.className = "word";
    var inner = document.createElement("span");
    if (innerClass) inner.className = innerClass;
    inner.textContent = text;
    outer.appendChild(inner);
    return outer;
  }

  /* ---------- 2. Scroll reveal (library-free, with safety nets) ---------- */
  var revealTargets = $$("[data-reveal], [data-reveal-words]");
  function reveal(el) { el.classList.add("is-in"); }
  if (reduce || !("IntersectionObserver" in window)) {
    revealTargets.forEach(reveal);
  } else {
    var ioFired = false;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { ioFired = true; reveal(e.target); io.unobserve(e.target); }
      });
    }, { threshold: 0.14, rootMargin: "0px 0px -8% 0px" });
    revealTargets.forEach(function (el) { io.observe(el); });

    // Net 1 — reveal whatever is already on screen without waiting on IO scheduling.
    var revealVisible = function () {
      revealTargets.forEach(function (el) {
        if (el.classList.contains("is-in")) return;
        var r = el.getBoundingClientRect();
        if (r.top < window.innerHeight * 0.96 && r.bottom > 0) reveal(el);
      });
    };
    raf(revealVisible);
    window.addEventListener("load", revealVisible);

    // Net 2 — if IO never fired at all (e.g. background/headless render), never leave
    // content stuck hidden: reveal everything and run the number/bar animations.
    setTimeout(function () {
      if (!ioFired) {
        revealTargets.forEach(reveal);
        counters.forEach(animateCount);
        bars.forEach(fillBar);
      }
    }, 1500);
  }

  /* ---------- 3. Anchor links -> native smooth scroll ---------- */
  $$('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (ev) {
      var id = a.getAttribute("href");
      if (id === "#" || id === "#top") {
        ev.preventDefault();
        window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
        closeMenu();
        return;
      }
      var target = document.querySelector(id);
      if (target) {
        ev.preventDefault();
        var y = target.getBoundingClientRect().top + window.pageYOffset - 64;
        window.scrollTo({ top: y, behavior: reduce ? "auto" : "smooth" });
        closeMenu();
      }
    });
  });

  /* ---------- 5. Nav: sticky state + mobile toggle ---------- */
  var nav = document.getElementById("nav");
  var navToggle = document.getElementById("navToggle");
  function onScrollNav() { if (nav) nav.classList.toggle("is-stuck", window.pageYOffset > 12); }
  window.addEventListener("scroll", onScrollNav, { passive: true });
  onScrollNav();
  function closeMenu() {
    if (nav) nav.classList.remove("open");
    if (navToggle) navToggle.setAttribute("aria-expanded", "false");
  }
  if (navToggle) {
    navToggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(open));
    });
  }

  /* ---------- 6. Scroll progress bar + back-to-top ---------- */
  var progress = document.getElementById("scrollProgress");
  var toTop = document.getElementById("toTop");
  function onScrollUI() {
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    var p = max > 0 ? window.pageYOffset / max : 0;
    if (progress) progress.style.transform = "scaleX(" + p + ")";
    if (toTop) toTop.classList.toggle("show", window.pageYOffset > 600);
  }
  window.addEventListener("scroll", onScrollUI, { passive: true });
  onScrollUI();

  /* ---------- 7. Number counters ---------- */
  function animateCount(el) {
    if (el.getAttribute("data-counted")) return;
    el.setAttribute("data-counted", "1");
    var target = parseFloat(el.getAttribute("data-count"));
    if (isNaN(target)) return;
    var prefix = el.getAttribute("data-prefix") || "";
    var suffix = el.getAttribute("data-suffix") || "";
    var decimals = (String(target).split(".")[1] || "").length;
    if (reduce) { el.textContent = prefix + target + suffix; return; }
    var start = null, dur = 1400;
    function tick(ts) {
      if (start === null) start = ts;
      var t = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - t, 3);
      var val = (target * eased).toFixed(decimals);
      el.textContent = prefix + val + suffix;
      if (t < 1) raf(tick); else el.textContent = prefix + target + suffix;
    }
    raf(tick);
  }
  var counters = $$("[data-count]");
  if ("IntersectionObserver" in window && !reduce) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { animateCount(e.target); cio.unobserve(e.target); }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { cio.observe(el); });
  } else { counters.forEach(animateCount); }

  /* ---------- 8. Bar fills ---------- */
  function fillBar(el) {
    if (el.getAttribute("data-filled")) return;
    el.setAttribute("data-filled", "1");
    var w = el.getAttribute("data-bar");
    el.style.transition = reduce ? "none" : "width 1.4s cubic-bezier(.22,1,.36,1)";
    raf(function () { el.style.width = w + "%"; });
  }
  var bars = $$("[data-bar]");
  if ("IntersectionObserver" in window && !reduce) {
    var bio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { fillBar(e.target); bio.unobserve(e.target); }
      });
    }, { threshold: 0.6 });
    bars.forEach(function (el) { bio.observe(el); });
  } else { bars.forEach(fillBar); }

  /* ---------- 9. Mouse interactions (fine pointers only) ---------- */
  if (finePointer && !reduce) {
    // 9a. 3D tilt
    $$("[data-tilt], [data-tilt-soft]").forEach(function (el) {
      var soft = el.hasAttribute("data-tilt-soft");
      var max = soft ? 5 : 12;
      var frame;
      el.addEventListener("mousemove", function (e) {
        var r = el.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        if (frame) cancelAnimationFrame(frame);
        frame = raf(function () {
          el.style.transform = "perspective(1000px) rotateX(" + (-py * max).toFixed(2) +
            "deg) rotateY(" + (px * max).toFixed(2) + "deg) translateZ(0)";
        });
      });
      el.addEventListener("mouseleave", function () {
        if (frame) cancelAnimationFrame(frame);
        el.style.transform = "perspective(1000px) rotateX(0) rotateY(0)";
      });
    });

    // 9b. Spotlight cursor cards (service bento + feature + step + plan cards)
    $$(".card--spot, .feature, .step, .plan").forEach(function (el) {
      el.addEventListener("mousemove", function (e) {
        var r = el.getBoundingClientRect();
        el.style.setProperty("--mx", (e.clientX - r.left) + "px");
        el.style.setProperty("--my", (e.clientY - r.top) + "px");
      });
    });

    // 9c. Magnetic buttons
    $$("[data-magnetic]").forEach(function (el) {
      var strength = 0.32;
      el.addEventListener("mousemove", function (e) {
        var r = el.getBoundingClientRect();
        var x = (e.clientX - r.left - r.width / 2) * strength;
        var y = (e.clientY - r.top - r.height / 2) * strength;
        el.style.transform = "translate(" + x.toFixed(1) + "px," + y.toFixed(1) + "px)";
      });
      el.addEventListener("mouseleave", function () { el.style.transform = "translate(0,0)"; });
    });

    // 9d. Interactive hero layer — cursor spotlight, background parallax & 3D scene tilt
    var meshField = document.getElementById("meshField");
    var heroSpot = document.getElementById("heroSpot");
    var sceneEl = document.getElementById("heroScene");
    var heroEl = document.querySelector(".hero");
    var mx = 0, my = 0, cx = 0, cy = 0, ticking = false;
    window.addEventListener("mousemove", function (e) {
      mx = (e.clientX / window.innerWidth - 0.5);
      my = (e.clientY / window.innerHeight - 0.5);
      if (!ticking) { ticking = true; raf(loop); }
    }, { passive: true });
    function loop() {
      cx += (mx - cx) * 0.07;
      cy += (my - cy) * 0.07;
      if (meshField) meshField.style.transform = "translate3d(" + (cx * 30).toFixed(1) + "px," + (cy * 24).toFixed(1) + "px,0)";
      if (sceneEl) sceneEl.style.transform = "rotateY(" + (cx * 12).toFixed(2) + "deg) rotateX(" + (cy * -9).toFixed(2) + "deg)";
      if (Math.abs(mx - cx) > 0.0008 || Math.abs(my - cy) > 0.0008) { raf(loop); } else { ticking = false; }
    }
    // spotlight tracks the cursor inside the hero (scoped, in %)
    if (heroEl && heroSpot) {
      heroEl.addEventListener("mousemove", function (e) {
        var r = heroEl.getBoundingClientRect();
        heroSpot.style.setProperty("--hx", (((e.clientX - r.left) / r.width) * 100).toFixed(1) + "%");
        heroSpot.style.setProperty("--hy", (((e.clientY - r.top) / r.height) * 100).toFixed(1) + "%");
      }, { passive: true });
    }
  }

  /* ---------- 9e. Hero canvas dot-globe: a real rotating 3D Earth ---------- */
  // Fibonacci-sphere points projected per frame. Front hemisphere glows EarthLink
  // orange, the back fades cool — genuine 3D depth. The mouse steers spin & tilt.
  (function initGlobe() {
    var canvas = document.getElementById("globeCanvas");
    if (!canvas || !canvas.getContext) return;
    var ctx = canvas.getContext("2d");
    if (!ctx) return;
    var SIZE = 640, DPR = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = SIZE * DPR;
    canvas.height = SIZE * DPR;
    ctx.scale(DPR, DPR);

    var CX = 320, CY = 320, R = 205, N = 320;
    var GOLD = Math.PI * (3 - Math.sqrt(5));
    var pts = [];
    for (var i = 0; i < N; i++) {
      var py = 1 - (i / (N - 1)) * 2;                    // -1 … 1
      var pr = Math.sqrt(Math.max(0, 1 - py * py));
      var th = GOLD * i;
      pts.push({ x: Math.cos(th) * pr, y: py, z: Math.sin(th) * pr });
    }

    var rot = 0.6, tilt = -0.32, tTilt = -0.32, spin = 0, tSpin = 0;
    function draw() {
      ctx.clearRect(0, 0, SIZE, SIZE);
      var cR = Math.cos(rot), sR = Math.sin(rot);
      var cT = Math.cos(tilt), sT = Math.sin(tilt);
      for (var i = 0; i < pts.length; i++) {
        var p = pts[i];
        var x = p.x * cR + p.z * sR;                     // yaw (the spin)
        var z = p.z * cR - p.x * sR;
        var y2 = p.y * cT - z * sT;                      // pitch (axial tilt)
        var z2 = p.y * sT + z * cT;
        var depth = (z2 + 1) / 2;                        // 0 = back … 1 = front
        ctx.beginPath();
        ctx.arc(CX + x * R, CY + y2 * R, 0.9 + depth * 1.7, 0, 6.2832);
        ctx.fillStyle = z2 > 0
          ? "rgba(255,178,92," + (0.28 + depth * 0.62).toFixed(3) + ")"
          : "rgba(150,156,170," + (0.10 + depth * 0.22).toFixed(3) + ")";
        ctx.fill();
      }
    }
    draw();                                              // always paint at least one frame
    if (reduce) return;                                  // reduced motion: static globe

    if (finePointer) {
      window.addEventListener("mousemove", function (e) {
        tSpin = (e.clientX / window.innerWidth - 0.5) * 0.00035;   // steer spin speed
        tTilt = -0.32 + (e.clientY / window.innerHeight - 0.5) * 0.3;
      }, { passive: true });
    }
    var visible = true;                                  // pause off-screen (perf)
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (en) { visible = en[0].isIntersecting; },
        { threshold: 0 }).observe(canvas);
    }
    var last = 0;
    function frame(t) {
      raf(frame);
      if (!visible) { last = t; return; }
      var dt = Math.min(t - last || 16, 48);
      last = t;
      spin += (tSpin - spin) * 0.06;
      tilt += (tTilt - tilt) * 0.06;
      rot += dt * (0.00016 + spin);
      draw();
    }
    raf(frame);
  })();

  /* ---------- 10. GSAP ScrollTrigger flourishes ---------- */
  if (hasST && !reduce) {
    window.gsap.registerPlugin(window.ScrollTrigger);

    // gentle continuous float for the shield illustration
    if ($(".art-float")) {
      window.gsap.to(".art-float", { y: -14, duration: 3, ease: "sine.inOut", yoyo: true, repeat: -1 });
    }
    // Hero globe scene: entrance, data packets on routes, orbiting satellite & readouts
    (function initHeroScene() {
      var scene = document.getElementById("heroScene");
      if (!scene) return;
      var g = window.gsap;
      var pills = $$(".fpill", scene);

      // entrance — the planet fades up, then routes light on in sequence
      g.from("#globeCanvas", { opacity: 0, scale: 0.92, duration: 1, ease: "power2.out", delay: 0.15 });
      g.from(".garc", { opacity: 0, duration: 0.9, stagger: 0.14, ease: "power2.out", delay: 0.4 });

      if (window.MotionPathPlugin) {
        g.registerPlugin(window.MotionPathPlugin);
        var svg = scene.querySelector(".globe-arcs");
        var NS = "http://www.w3.org/2000/svg";

        // data packets travel each route — one each way, like real traffic
        $$(".garc", scene).forEach(function (path, ri) {
          for (var k = 0; k < 2; k++) {
            var dot = document.createElementNS(NS, "circle");
            dot.setAttribute("r", (2.1 + (k % 2)).toFixed(1));
            dot.setAttribute("class", "fparticle");
            svg.appendChild(dot);
            g.to(dot, {
              duration: 2.1 + ri * 0.3 + k * 0.6,
              repeat: -1,
              delay: k * 1.05 + ri * 0.35,
              ease: "power1.inOut",
              motionPath: { path: path, align: path, alignOrigin: [0.5, 0.5],
                start: k ? 1 : 0, end: k ? 0 : 1 }
            });
          }
        });

        // the satellite rides the orbit ring — the logo mark, animated
        var orbit = scene.querySelector(".gorbit");
        var sat = scene.querySelector(".gsat");
        if (orbit && sat) {
          var orbitPath = window.MotionPathPlugin.convertToPath(orbit)[0];
          g.to(sat, { duration: 16, repeat: -1, ease: "none",
            motionPath: { path: orbitPath, align: orbitPath, alignOrigin: [0.5, 0.5] } });
        }
      }

      // glass readouts: 3D depth + spring-in, then a gentle idle float
      pills.forEach(function (p, i) {
        var d = parseFloat(p.getAttribute("data-depth")) || 1;
        g.set(p, { z: (d - 1) * 120, opacity: 0, y: 24, scale: 0.85 });
        g.to(p, { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "back.out(1.7)", delay: 0.6 + i * 0.15 });
        g.to(p, { y: i % 2 ? 10 : -10, duration: 3 + i * 0.4, ease: "sine.inOut",
          yoyo: true, repeat: -1, delay: 1.7 + i * 0.2 });
      });

      // safety: never leave a readout stuck hidden if the ticker stalls
      setTimeout(function () {
        pills.forEach(function (p) {
          if (parseFloat(getComputedStyle(p).opacity) < 0.05) g.set(p, { opacity: 1, y: 0, scale: 1 });
        });
      }, 2600);
    })();

    // hero scroll choreography (scrub) — copy lifts & fades, the fiber scene recedes,
    // the dot layer parallaxes. (Not applied to #fiber / #meshField — the mouse loop owns those.)
    var heroSection = document.querySelector(".hero");
    if (heroSection) {
      window.gsap.to(".hero-copy", { yPercent: -12, opacity: 0.3, ease: "none",
        scrollTrigger: { trigger: heroSection, start: "top top", end: "bottom top", scrub: true } });
      window.gsap.to(".hero-visual", { yPercent: -16, scale: 0.9, ease: "none",
        scrollTrigger: { trigger: heroSection, start: "top top", end: "bottom top", scrub: true } });
      window.gsap.to(".hero-dots", { yPercent: 22, ease: "none",
        scrollTrigger: { trigger: heroSection, start: "top top", end: "bottom top", scrub: true } });
    }
  }

  /* ---------- 11. Lead form (client-side demo handler) ---------- */
  var form = document.getElementById("leadForm");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var note = document.getElementById("formNote");
      var consent = document.getElementById("consent");
      var name = document.getElementById("name");
      var addr = document.getElementById("addr");
      var phone = document.getElementById("phone");
      if (!name.value.trim() || !addr.value.trim() || !phone.value.trim()) {
        setNote(note, "Please add your name, address, and phone so we can check availability.", true);
        return;
      }
      if (!consent.checked) {
        setNote(note, "Please tick the consent box so we can contact you with your quote.", true);
        return;
      }
      // NOTE: wire this up to your CRM / form endpoint. Demo only — no data is sent.
      form.querySelectorAll("input,select,button").forEach(function (el) { el.setAttribute("disabled", ""); });
      setNote(note, "Thanks, " + name.value.trim().split(" ")[0] + "! A specialist will confirm your options shortly. (Demo form — connect your endpoint to go live.)", false);
    });
  }
  function setNote(note, msg, isError) {
    if (!note) return;
    note.textContent = msg;
    note.style.color = isError ? "#c0392b" : "var(--o-700)";
    note.style.fontWeight = "700";
  }

  /* ---------- 12. FAQ accordion — opening one closes the rest ---------- */
  var faqItems = $$(".faq-item");
  faqItems.forEach(function (item) {
    item.addEventListener("toggle", function () {
      if (item.open) {
        faqItems.forEach(function (other) {
          if (other !== item) other.open = false;
        });
      }
    });
  });
})();
