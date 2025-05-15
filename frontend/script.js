// Gallery Lightbox
function setupGalleryLightbox() {
  document.querySelectorAll(".gallery-img").forEach((img) => {
    img.addEventListener("click", () => {
      const lightbox = document.getElementById("lightbox");
      const lightboxImg = document.getElementById("lightbox-img");
      if (lightbox && lightboxImg) {
        lightboxImg.src = img.src;
        lightbox.classList.remove("hidden");
      }
    });
  });
}

// Close lightbox when clicking the close button
const closeLightboxBtn = document.getElementById("close-lightbox");
if (closeLightboxBtn) {
  closeLightboxBtn.addEventListener("click", () => {
    const lightbox = document.getElementById("lightbox");
    if (lightbox) {
      lightbox.classList.add("hidden");
    }
  });
}

// Load Gallery Images
function loadGallery() {
  const galleryGrid = document.getElementById("gallery-grid");
  if (!galleryGrid) {
    console.log("Gallery grid element not found");
    return;
  }

  galleryGrid.innerHTML = '<p class="text-center text-gray-600">Loading gallery...</p>';

  fetch("https://henna-art.onrender.com/get-gallery") // Use absolute backend URL
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      galleryGrid.innerHTML = "";
      console.log("Gallery data received:", data);

      if (data.images && data.images.length > 0) {
        data.images.forEach((image) => {
          console.log("Adding image to grid:", image);
          const imgDiv = document.createElement("div");
          imgDiv.className = "mb-6";

          const imgElement = document.createElement("img");
          imgElement.src = `https://henna-art.onrender.com/uploads/${image}?t=${Date.now()}`; // Absolute backend URL
          imgElement.alt = "Henna Design";
          imgElement.classList.add(
            "w-full",
            "h-64",
            "object-cover",
            "rounded-lg",
            "cursor-pointer",
            "gallery-img"
          );

          imgDiv.appendChild(imgElement);
          galleryGrid.appendChild(imgDiv);
        });

        setupGalleryLightbox();
      } else {
        galleryGrid.innerHTML =
          '<p class="text-center text-gray-600">No images available yet.</p>';
      }
    })
    .catch((error) => {
      console.error("Error loading gallery:", error);
      galleryGrid.innerHTML =
        '<p class="text-center text-red-600">Failed to load gallery. Please try again later.</p>';
    });
}

// Contact Form Submission
const contactForm = document.getElementById("contact-form");
if (contactForm) {
  contactForm.addEventListener("submit", submitContactForm);
}

function submitContactForm(event) {
  event.preventDefault();
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const message = document.getElementById("message").value;
  const formMessage = document.getElementById("form-message");

  if (!formMessage) {
    console.error("Form message element not found");
    return;
  }

  if (name && email && message) {
    fetch("/send-message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, message }),
    })
      .then((response) => {
        console.log("Response Status:", response.status);
        if (!response.ok) {
          return response.text().then((text) => {
            throw new Error(`Server error: ${response.status} - ${text}`);
          });
        }
        return response.json();
      })
      .then((data) => {
        console.log("Response Data:", data);
        if (data.success) {
          formMessage.classList.remove("hidden", "text-red-600");
          formMessage.classList.add("text-green-600");
          formMessage.textContent =
            "Message sent successfully! We will get back to you soon.";
          contactForm.reset();
        } else {
          formMessage.classList.remove("hidden", "text-green-600");
          formMessage.classList.add("text-red-600");
          formMessage.textContent =
            "Failed to send message: " +
            (data.message || "Please try again later.");
        }
      })
      .catch((error) => {
        console.error("Fetch Error:", error);
        formMessage.classList.remove("hidden", "text-green-600");
        formMessage.classList.add("text-red-600");
        formMessage.textContent = "An error occurred: " + error.message;
      });
  } else {
    formMessage.classList.remove("hidden", "text-green-600");
    formMessage.classList.add("text-red-600");
    formMessage.textContent = "Please fill out all required fields.";
  }
}

// Booking Form Submission
const bookingForm = document.getElementById("booking-form");
if (bookingForm) {
  bookingForm.addEventListener("submit", submitBookingForm);
}

function submitBookingForm(event) {
  event.preventDefault();
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const date = document.getElementById("date").value;
  const service = document.getElementById("service").value;
  const notes = document.getElementById("notes").value;

  if (name && email && date && service) {
    fetch(`https://henna-art.onrender.com/submit-booking`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, date, service, notes }),
    })
      .then((response) => {
        console.log("Response Status:", response.status);
        if (!response.ok) {
          return response.text().then((text) => {
            throw new Error(`Server error: ${response.status} - ${text}`);
          });
        }
        return response.json();
      })
      .then((data) => {
        if (data.success) {
          alert(
            "Booking submitted successfully! We will confirm your appointment soon."
          );
          bookingForm.reset();
        } else {
          alert("Error: " + data.message);
        }
      })
      .catch((error) => {
        alert("There was an error submitting your booking: " + error.message);
        console.error("Booking error:", error);
      });
  } else {
    alert("Please fill out all required fields.");
  }
}

// Initialize the page - load gallery if we're on the gallery page
document.addEventListener("DOMContentLoaded", function() {
  console.log("Document loaded, checking for gallery-grid element");
  if (document.getElementById("gallery-grid")) {
    console.log("Gallery grid found, loading gallery");
    loadGallery();
  }
});