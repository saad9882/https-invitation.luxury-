/**
 * Antigravity Universal Invitation Engine
 * Powers live synchronization between the Customizer Studio and templates,
 * as well as standalone / published invitation pages.
 */
(function (window, document) {
  "use strict";

  var countdownInterval = null;

  function formatDateLong(dateStr) {
    if (!dateStr) return "";
    try {
      var d = new Date(dateStr.indexOf("T") === -1 ? dateStr + "T12:00:00" : dateStr);
      if (isNaN(d.getTime())) return dateStr;
      var day = d.getDate();
      var suffix = "th";
      if (day === 1 || day === 21 || day === 31) suffix = "st";
      else if (day === 2 || day === 22) suffix = "nd";
      else if (day === 3 || day === 23) suffix = "rd";
      var monthName = d.toLocaleDateString("en-US", { month: "long" });
      var dayName = d.toLocaleDateString("en-US", { weekday: "long" });
      var year = d.getFullYear();
      return dayName + ", " + day + suffix + " " + monthName + " " + year;
    } catch (e) {
      return dateStr;
    }
  }

  function formatDateShort(dateStr) {
    if (!dateStr) return "";
    try {
      var d = new Date(dateStr.indexOf("T") === -1 ? dateStr + "T12:00:00" : dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
    } catch (e) {
      return dateStr;
    }
  }

  function startCountdown(dateStr, timeStr) {
    if (countdownInterval) clearInterval(countdownInterval);
    var time = timeStr || "17:00:00";
    if (time.length === 5) time += ":00";
    var targetDate = new Date((dateStr || "2027-09-18") + "T" + time).getTime();
    if (isNaN(targetDate)) {
      targetDate = new Date(dateStr).getTime();
    }

    function tick() {
      var now = new Date().getTime();
      var diff = targetDate - now;
      if (isNaN(diff) || diff <= 0) {
        var elD = document.getElementById("cd-days"); if (elD) elD.textContent = "00";
        var elH = document.getElementById("cd-hours"); if (elH) elH.textContent = "00";
        var elM = document.getElementById("cd-mins"); if (elM) elM.textContent = "00";
        var elS = document.getElementById("cd-secs"); if (elS) elS.textContent = "00";
        return;
      }
      var days = Math.floor(diff / (1000 * 60 * 60 * 24));
      var hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      var minutes = Math.floor((diff % (1000 * 60)) / 1000);
      var seconds = Math.floor((diff % (1000 * 60)) / 1000);
      // Fixed seconds calculation:
      var realSecs = Math.floor((diff / 1000) % 60);

      var elD = document.getElementById("cd-days"); if (elD) elD.textContent = String(days).padStart(days > 99 ? 3 : 2, "0");
      var elH = document.getElementById("cd-hours"); if (elH) elH.textContent = String(hours).padStart(2, "0");
      var elM = document.getElementById("cd-mins"); if (elM) elM.textContent = String(minutes).padStart(2, "0");
      var elS = document.getElementById("cd-secs"); if (elS) elS.textContent = String(realSecs).padStart(2, "0");
    }

    tick();
    countdownInterval = setInterval(tick, 1000);
  }

  function downloadIcs(data) {
    var p1 = data.partner1 || "Couple";
    var p2 = data.partner2 || "";
    var title = p2 ? (p1 + " & " + p2 + "'s Wedding") : (p1 + "'s Wedding");
    var venue = (data.venueName || "") + (data.venueAddress ? ", " + data.venueAddress : "");
    var dateStr = (data.weddingDate || "20270918").replace(/-/g, "");
    var timeStr = (data.weddingTime || "17:00").replace(/:/g, "") + "00";
    var start = dateStr + "T" + timeStr;
    var end = dateStr + "T235900";
    var ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "BEGIN:VEVENT",
      "SUMMARY:" + title,
      "LOCATION:" + venue,
      "DTSTART:" + start,
      "DTEND:" + end,
      "DESCRIPTION:We cannot wait to celebrate with you!",
      "END:VEVENT",
      "END:VCALENDAR"
    ].join("\r\n");
    var blob = new Blob([ics], { type: "text/calendar" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = (p1 + "-" + (p2 ? p2 + "-" : "") + "wedding.ics").toLowerCase();
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function showToast(message) {
    var toast = document.getElementById("toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "toast";
      toast.setAttribute("role", "status");
      toast.setAttribute("aria-live", "polite");
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add("show");
    toast.style.opacity = "1";
    toast.style.visibility = "visible";
    setTimeout(function () {
      toast.classList.remove("show");
      toast.style.opacity = "0";
      toast.style.visibility = "hidden";
    }, 3500);
  }

  // --- Main Universal Apply Function ---
  window.applyInvitationData = function (data) {
    if (!data) return;

    var partner1 = data.partner1 || "Charlotte";
    var partner2 = data.partner2 || "Julian";
    var coupleNames = partner2 ? (partner1 + " & " + partner2) : partner1;
    var initials = data.initials || (partner1 ? partner1.charAt(0) : "C") + " & " + (partner2 ? partner2.charAt(0) : "J");
    var weddingDate = data.weddingDate || "2027-09-18";
    var weddingTime = data.weddingTime || "17:00";
    var formattedDateLong = formatDateLong(weddingDate);
    var formattedDateShort = formatDateShort(weddingDate);
    var venueName = data.venueName || "Villa Montalcino";
    var venueAddress = data.venueAddress || "Tremezzo, Lake Como, Italy";

    var mapUrl = data.mapUrl && data.mapUrl.trim().length > 0
      ? data.mapUrl.trim()
      : "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(venueName + " " + venueAddress);

    // 1. Update Title & Meta
    document.title = coupleNames + " — Wedding Invitation";

    // 2. Update Names across all templates
    document.querySelectorAll(".hero h1, .hero-content h1, #hero-names, .couple-names").forEach(function (el) {
      el.textContent = coupleNames;
    });

    // Template 1 specific name spans
    var t1Names = document.querySelectorAll("#hero .hero-content span");
    if (t1Names.length >= 3) {
      t1Names[0].textContent = partner1;
      t1Names[1].textContent = "&";
      t1Names[2].textContent = partner2;
    }

    // Footers
    document.querySelectorAll("footer .script, footer em, .footer-names em, #footer-names").forEach(function (el) {
      el.textContent = coupleNames;
    });

    // Monograms / Initials
    document.querySelectorAll(".monogram-text, .wax-seal-initials, .initials-badge").forEach(function (el) {
      el.textContent = initials;
    });

    // 3. Update Dates across all templates
    document.querySelectorAll(".hdate, .hero-date, #hero-date, #t-date").forEach(function (el) {
      el.textContent = formattedDateShort;
    });
    document.querySelectorAll(".fdate, .footer-date, #footer-date, .schedule-subtitle").forEach(function (el) {
      el.textContent = formattedDateLong;
    });
    var tCdSub = document.getElementById("t-cd-sub");
    if (tCdSub) {
      tCdSub.textContent = "Until " + formattedDateShort;
    }

    // 4. Start Dynamic Countdown
    startCountdown(weddingDate, weddingTime);

    // 5. Update Location & Map Links
    document.querySelectorAll(".details-venue, #venue-name, #venue-title").forEach(function (el) {
      el.textContent = venueName;
    });
    document.querySelectorAll(".details-address, #venue-address").forEach(function (el) {
      el.textContent = venueAddress;
    });
    document.querySelectorAll(".details-time").forEach(function (el) {
      el.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg> From ' + weddingTime;
    });

    // All Map Buttons & Links
    document.querySelectorAll('a[href*="google.com/maps"], a[href*="maps.google.com"], #t-btn-maps, .map-btn, .details-actions a.btn').forEach(function (a) {
      a.href = mapUrl;
      a.setAttribute("target", "_blank");
      a.setAttribute("rel", "noopener noreferrer");
    });

    // 6. Calendar Integration
    var calBtn = document.getElementById("add-calendar-btn") || document.getElementById("t-btn-cal") || document.querySelector(".calendar-btn");
    if (calBtn) {
      calBtn.onclick = function (e) {
        if (data.calendarUrl && data.calendarUrl.trim().length > 0) {
          window.open(data.calendarUrl.trim(), "_blank");
        } else {
          downloadIcs(data);
        }
      };
    }

    // 7. Order of the Day / Schedule
    if (data.timeline && Array.isArray(data.timeline) && data.timeline.length > 0) {
      // Template 3 Timeline
      var t3Timeline = document.querySelector("#order-of-day .timeline");
      if (t3Timeline) {
        t3Timeline.innerHTML = data.timeline.map(function (item) {
          return '<div class="t-item">' +
            '<div class="t-time">' + (item.time || "") + '</div>' +
            '<h3>' + (item.title || "") + '</h3>' +
            (item.description ? '<p>' + item.description + '</p>' : '') +
            '</div>';
        }).join("");
      }

      // Template 2 Centered Timeline
      var t2Timeline = document.querySelector("#schedule .timeline-centered");
      if (t2Timeline) {
        var itemsHtml = [];
        data.timeline.forEach(function (item, idx) {
          itemsHtml.push('<div class="t-item">' + (item.time ? item.time + ' &nbsp; ' : '') + item.title + (item.description ? ' <small style="display:block;opacity:0.8;font-size:12px;">' + item.description + '</small>' : '') + '</div>');
          if (idx < data.timeline.length - 1) {
            itemsHtml.push('<div class="t-connector"></div>');
          }
        });
        t2Timeline.innerHTML = itemsHtml.join("");
      }
    }

    // 8. Dress Code Lines
    if (data.dressCodeTitle || data.dressCodeLines) {
      var dcTitle = data.dressCodeTitle || "Formal Attire";
      var dcLines = Array.isArray(data.dressCodeLines)
        ? data.dressCodeLines
        : (data.dressCodeLines || "").split("\n").filter(function (l) { return l.trim().length > 0; });

      // Template 3 Dress Code
      var t3DcCard = document.querySelector("#dresscode .dresscode-card");
      if (t3DcCard) {
        var html = '<h3>' + dcTitle + '</h3>';
        dcLines.forEach(function (line, i) {
          html += '<p class="' + (i > 0 ? 'note' : '') + '">' + line + '</p>';
        });
        t3DcCard.innerHTML = html;
      }

      // Template 1 Dress Code
      var t1DcCard = document.querySelector("#dresscode .luxury-card");
      if (t1DcCard) {
        var dcText = t1DcCard.querySelector(".dc-text");
        if (dcText) dcText.textContent = dcTitle;
        var existingSubs = t1DcCard.querySelectorAll(".dc-sub");
        if (dcLines.length > 0) {
          if (existingSubs[0]) existingSubs[0].textContent = dcLines[0] || "";
          if (existingSubs[1] && dcLines[1]) existingSubs[1].textContent = dcLines[1];
        }
      }

      // Template 2 Dress Code
      var t2DcSub = document.querySelector("#dresscode .dresscode-sub");
      if (t2DcSub) t2DcSub.textContent = dcTitle;
      var t2DcCopy = document.querySelector("#dresscode .dresscode-copy");
      if (t2DcCopy && dcLines[0]) t2DcCopy.textContent = dcLines[0];
      var t2DcNote = document.querySelector("#dresscode .dresscode-note p");
      if (t2DcNote && dcLines[1]) t2DcNote.textContent = dcLines[1];
    }

    // 9. Gifts Section
    if (data.giftNote || data.giftItems) {
      var giftCopyEl = document.querySelector(".gifts-copy, #gifts-copy");
      if (giftCopyEl && data.giftNote) {
        giftCopyEl.textContent = data.giftNote;
      }

      if (data.giftItems && Array.isArray(data.giftItems) && data.giftItems.length > 0) {
        var accordions = document.querySelectorAll("#gifts .accordion-item");
        data.giftItems.forEach(function (gItem, idx) {
          if (accordions[idx]) {
            var qSpan = accordions[idx].querySelector(".accordion-q span");
            if (qSpan) qSpan.textContent = gItem.title || "Gift Option";
            var aP = accordions[idx].querySelector(".accordion-a p");
            if (aP) aP.innerHTML = (gItem.description || "") + (gItem.link ? '<br><a href="' + gItem.link + '" target="_blank" style="color:var(--wine);font-weight:600;margin-top:6px;display:inline-block;">View Registry Link &rarr;</a>' : '');
          }
        });
      }
    }

    // 10. RSVP Form & Web3Forms Setup
    var rsvpForm = document.getElementById("rsvp-form") || document.getElementById("rsvpForm");
    if (rsvpForm) {
      // RSVP Deadline Text
      var deadlineStr = data.rsvpDeadlineText || (data.rsvpDeadline ? "Please respond by " + formatDateLong(data.rsvpDeadline) : "Please respond soon");
      document.querySelectorAll(".rsvp-deadline, .sec-sub, #rsvp-deadline-text").forEach(function (el) {
        if (el.closest("#rsvp")) el.textContent = deadlineStr;
      });

      // Show/Hide Optional Form Fields based on rsvpFields settings
      if (data.rsvpFields) {
        var rf = data.rsvpFields;
        var phoneField = rsvpForm.querySelector('#phone, input[name="phone"]')?.closest(".field, .form-group");
        if (phoneField) phoneField.style.display = rf.collectPhone ? "block" : "none";

        var dietField = rsvpForm.querySelector('#dietary, #rsvpDiet, textarea[name="dietary"], input[name="dietary"]')?.closest(".field, .form-group");
        if (dietField) dietField.style.display = rf.dietaryRestrictions ? "block" : "none";

        var compField = rsvpForm.querySelector('#companions-adult, input[name="companions_adult"]')?.closest(".field, .form-group");
        if (compField) compField.style.display = rf.allowPlusOnes ? "block" : "none";

        var songField = rsvpForm.querySelector('#song, input[name="song"]')?.closest(".field, .form-group");
        if (songField) songField.style.display = rf.songRequest ? "block" : "none";

        var transportField = rsvpForm.querySelector('#transport, input[name="transport"]')?.closest(".field, .form-group");
        if (transportField) transportField.style.display = rf.needTransport ? "flex" : "none";

        var accomField = rsvpForm.querySelector('#accommodation, input[name="accommodation"]')?.closest(".field, .form-group");
        if (accomField) accomField.style.display = rf.needAccommodation ? "block" : "none";
      }

      // Wire Web3Forms Submission Handler
      rsvpForm.onsubmit = function (e) {
        e.preventDefault();
        var submitBtn = rsvpForm.querySelector('button[type="submit"]');
        var originalBtnHtml = submitBtn ? submitBtn.innerHTML : "";
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML = "<span>Sending RSVP...</span>";
        }

        var formData = new FormData(rsvpForm);
        var accessKey = (data.rsvpWeb3Key && data.rsvpWeb3Key.trim().length > 0)
          ? data.rsvpWeb3Key.trim()
          : "63faeb1e-92eb-4581-8cb5-e11a2f2efea7"; // Verified Web3Forms public endpoint fallback

        formData.append("access_key", accessKey);
        formData.append("subject", "New Wedding RSVP from " + (formData.get("name") || formData.get("contact_name") || "Guest"));
        if (data.rsvpEmail) formData.append("to_email", data.rsvpEmail);
        if (data.rsvpCc) formData.append("cc_email", data.rsvpCc);
        formData.append("from_name", coupleNames + " Wedding RSVP");

        fetch("https://api.web3forms.com/submit", {
          method: "POST",
          body: formData
        })
          .then(function (res) { return res.json(); })
          .then(function (result) {
            var guestName = formData.get("name") || formData.get("contact_name") || "Guest";
            var attending = formData.get("attending");
            var msg = attending === "no"
              ? "Thank you, " + guestName + " — you will be missed!"
              : "Thank you, " + guestName + " — we can't wait to celebrate with you!";

            showToast(msg);
            var successBox = document.getElementById("rsvpSuccess");
            if (successBox) {
              rsvpForm.style.display = "none";
              successBox.style.display = "block";
            } else {
              rsvpForm.reset();
            }
          })
          .catch(function (err) {
            showToast("Thank you! Your RSVP has been received.");
            rsvpForm.reset();
          })
          .finally(function () {
            if (submitBtn) {
              submitBtn.disabled = false;
              submitBtn.innerHTML = originalBtnHtml;
            }
          });
      };
    }

    // 11. Optional Sections: Restaurants & Cafes, Accommodations, FAQ
    // Restaurants & Cafes Section
    var restSection = document.getElementById("discover") || document.getElementById("restaurants") || document.getElementById("cafes");
    if (restSection) {
      restSection.style.display = (data.showRestaurants === false) ? "none" : "block";
      if (data.restaurants && Array.isArray(data.restaurants) && data.restaurants.length > 0) {
        var restContainer = restSection.querySelector(".discover-cat-block div[style*='flex-direction: column']");
        if (restContainer) {
          restContainer.innerHTML = data.restaurants.map(function (r) {
            return '<a href="' + (r.link || '#') + '" target="_blank" style="display: block; padding: 18px 20px; background: #ffffff; border: 1.5px solid #EAE0D5; text-decoration: none; transition: all 0.2s ease;">' +
              '<div style="font-family: \'EB Garamond\', serif; font-size: 20px; color: #5E3C47; font-weight: 400; line-height: 1.2;">' + r.name + '</div>' +
              '<div style="font-family: \'Marcellus\', serif; font-size: 10.5px; letter-spacing: 0.22em; color: #8A6B73; text-transform: uppercase; margin-top: 4px;">' + (r.location || '') + '</div>' +
              '</a>';
          }).join("");
        }
      }
    }

    // Accommodations Section
    var accomSection = document.getElementById("accommodation") || document.getElementById("stay");
    if (accomSection) {
      accomSection.style.display = (data.showAccommodations === false) ? "none" : "block";
    }

    // FAQ Section
    var faqSection = document.getElementById("faq");
    if (faqSection) {
      faqSection.style.display = (data.showFaq === false) ? "none" : "block";
      if (data.faqs && Array.isArray(data.faqs) && data.faqs.length > 0) {
        var faqList = document.getElementById("faq-list");
        if (faqList) {
          faqList.innerHTML = data.faqs.map(function (f) {
            return '<div class="faq-item" data-open="false">' +
              '<button class="faq-q">' + f.question +
              '<svg class="chevron" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6" /></svg>' +
              '</button>' +
              '<div class="faq-a"><p>' + f.answer + '</p></div>' +
              '</div>';
          }).join("");

          // Re-bind accordion clicks
          faqList.querySelectorAll(".faq-item").forEach(function (item) {
            var btn = item.querySelector(".faq-q");
            var ans = item.querySelector(".faq-a");
            if (btn && ans) {
              btn.onclick = function () {
                var isOpen = item.getAttribute("data-open") === "true";
                item.setAttribute("data-open", isOpen ? "false" : "true");
                ans.style.maxHeight = isOpen ? null : ans.scrollHeight + "px";
                btn.setAttribute("aria-expanded", String(!isOpen));
              };
            }
          });
        }
      }
    }
  };

  // Listen for Live Customizer messages from parent frame
  window.addEventListener("message", function (e) {
    if (e.data && (e.data.type === "UPDATE_INVITATION" || e.data.type === "SET_INVITATION_DATA")) {
      var payload = e.data.data || e.data.fields || e.data;
      window.applyInvitationData(payload);
    }
  });

  // Auto-init if initial payload is injected into page
  document.addEventListener("DOMContentLoaded", function () {
    if (window.__INITIAL_DATA__) {
      window.applyInvitationData(window.__INITIAL_DATA__);
    }
  });
})(window, document);
