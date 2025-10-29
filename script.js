const apodData = 'https://cdn.jsdelivr.net/gh/GCA-Classroom/apod/data.json';

const getImageBtn = document.getElementById('getImageBtn');
const gallery = document.getElementById('gallery');

const dateSelect = document.createElement('select');
dateSelect.id = 'startDate';
dateSelect.style.marginRight = '10px';
getImageBtn.parentNode.insertBefore(dateSelect, getImageBtn);

const details = document.createElement('div');
details.id = 'imageDetails';
details.style.marginTop = '20px';
details.style.width = '400px';
details.style.minWidth = '300px';
details.style.maxWidth = '500px';
details.style.height = '100%';
details.style.overflowY = 'auto';
details.style.padding = '16px';
details.style.boxSizing = 'border-box';
details.style.background = '#fff';
details.style.borderRight = '1px solid #eee';

const modal = document.createElement('div');
modal.id = 'imageModal';
modal.style.display = 'none';
modal.style.position = 'fixed';
modal.style.top = '0';
modal.style.left = '0';

const mainContainer = document.createElement('div');
mainContainer.id = 'mainContainer';
mainContainer.style.display = 'flex';
mainContainer.style.width = '100%';
mainContainer.style.height = '80vh';
mainContainer.style.boxSizing = 'border-box';


gallery.style.flex = '1';
gallery.style.overflowY = 'auto';
gallery.style.height = '100%';
gallery.style.padding = '16px';

mainContainer.appendChild(details);
mainContainer.appendChild(gallery);
getImageBtn.parentNode.parentNode.insertBefore(mainContainer, getImageBtn.parentNode.nextSibling);

const loadingMsg = document.createElement('div');
loadingMsg.id = 'loadingMsg';
loadingMsg.textContent = 'Loading images...';
loadingMsg.style.position = 'fixed';
loadingMsg.style.top = '50%';
loadingMsg.style.left = '50%';
loadingMsg.style.transform = 'translate(-50%, -50%)';
loadingMsg.style.background = '#fff';
loadingMsg.style.color = '#0b3d91';
loadingMsg.style.padding = '24px 40px';
loadingMsg.style.borderRadius = '12px';
loadingMsg.style.boxShadow = '0 2px 12px rgba(11,61,145,0.18)';
loadingMsg.style.fontSize = '1.3rem';
loadingMsg.style.zIndex = '2000';
loadingMsg.style.display = 'none';
document.body.appendChild(loadingMsg);

// Array of fun "Did You Know?" space facts
const spaceFacts = [
  "Did you know? The Sun accounts for about 99.86% of the mass in our solar system!",
  "Did you know? A day on Venus is longer than its year.",
  "Did you know? Neutron stars can spin at a rate of 600 rotations per second.",
  "Did you know? There are more stars in the universe than grains of sand on Earth.",
  "Did you know? Jupiter has 92 known moons!",
  "Did you know? The footprints on the Moon will remain for millions of years.",
  "Did you know? Saturn could float in water because it’s mostly gas.",
  "Did you know? The largest volcano in the solar system is on Mars.",
  "Did you know? Space is completely silent.",
  "Did you know? One million Earths could fit inside the Sun."
];

// Pick a random fact from the array
const randomFact = spaceFacts[Math.floor(Math.random() * spaceFacts.length)];

// Create a section to show the random fact above the gallery
const factSection = document.createElement('div');
factSection.id = 'didYouKnow';
factSection.textContent = randomFact;
factSection.style.background = '#f5faff';
factSection.style.color = '#0b3d91';
factSection.style.fontWeight = 'bold';
factSection.style.fontSize = '1.1rem';
factSection.style.padding = '14px 18px';
factSection.style.margin = '18px auto 8px auto';
factSection.style.borderRadius = '8px';
factSection.style.maxWidth = '650px';
factSection.style.boxShadow = '0 2px 8px rgba(11,61,145,0.08)';
factSection.style.textAlign = 'center';

// Insert the fact section above the gallery, near the header
const container = document.querySelector('.container');
container.parentNode.insertBefore(factSection, container.nextSibling);

function loadApodDates() {
  fetch(apodData)
    .then(response => response.json())
    .then(data => {
      window.apodJsonData = data;

      const dates = data.map(item => item.date);

      dates.forEach(date => {
        const option = document.createElement('option');
        option.value = date;
        option.textContent = date;
        dateSelect.appendChild(option);
      });
    })
    .catch(error => {
      gallery.innerHTML = `<p>Error loading date options. Please try again later.</p>`;
      console.error(error);
    });
}

loadApodDates();

details.style.display = 'none';

const modalContent = document.createElement('div');
modalContent.style.position = 'relative';
modal.appendChild(modalContent);

const closeBtn = document.createElement('button');
closeBtn.textContent = '×';
closeBtn.style.position = 'absolute';
closeBtn.style.top = '10px';
closeBtn.style.right = '16px';
closeBtn.style.fontSize = '2rem';
closeBtn.style.background = 'none';
closeBtn.style.border = 'none';
closeBtn.style.cursor = 'pointer';
closeBtn.style.color = '#fc3d21';
modalContent.appendChild(closeBtn);

document.body.appendChild(modal);

function closeModal() {
  modal.style.display = 'none';
  modalContent.innerHTML = '';
  modalContent.appendChild(closeBtn)
}

closeBtn.addEventListener('click', closeModal);

modal.addEventListener('click', function(event) {
  if (event.target === modal) {
    closeModal();
  }
});

function isVideo(item) {
  return item.media_type === "video" ||
    (typeof item.url === "string" && (
      item.url.includes("youtube.com") ||
      item.url.includes("youtu.be") ||
      item.url.includes("vimeo.com")
    ));
}

function fetchApodImages(startDate) {
  loadingMsg.style.display = 'block';
  gallery.innerHTML = '';

  const data = window.apodJsonData;
  if (!data) {
    gallery.innerHTML = `<p>Data not loaded yet. Please wait and try again.</p>`;
    loadingMsg.style.display = 'none';
    return;
  }

  const startIndex = data.findIndex(item => item.date === startDate);

  if (startIndex === -1) {
    gallery.innerHTML = `<p>No data found for ${startDate}. Try another date.</p>`;
    loadingMsg.style.display = 'none';
    return;
  }

  const images = data.slice(startIndex, startIndex + 9);

  // Build HTML for the responsive grid gallery
  let html = `
    <div style="
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 16px;
    ">
  `;
  images.forEach((item, idx) => {
    // If it's a video, embed a thumbnail or player
    if (isVideo(item)) {
      // Try to get a thumbnail for YouTube videos
      let thumb = '';
      if (item.url.includes('youtube.com') || item.url.includes('youtu.be')) {
        // Extract YouTube video ID
        let videoId = '';
        if (item.url.includes('youtube.com')) {
          const urlParams = new URLSearchParams(item.url.split('?')[1]);
          videoId = urlParams.get('v');
        } else if (item.url.includes('youtu.be')) {
          videoId = item.url.split('/').pop();
        }
        if (videoId) {
          thumb = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
        }
      }
      html += `
        <div class="apod-card" 
          style="cursor:pointer; border:1px solid #ccc; padding:8px; border-radius:8px; background:#fafafa;"
          data-index="${idx}">
          ${thumb ? `<img src="${thumb}" alt="Video thumbnail" style="width:100%;height:160px;object-fit:cover;border-radius:4px;" />` : `
            <div style="width:100%;height:160px;display:flex;align-items:center;justify-content:center;background:#eee;border-radius:4px;">
              <span style="font-size:2.5em;color:#0b3d91;">🎬</span>
            </div>
          `}
          <h4 style="margin:8px 0 4px 0;">${item.title}</h4>
          <p style="margin:0;font-size:0.9em;color:#555;">${item.date}</p>
        </div>
      `;
    } else {
      // Image entry
      html += `
        <div class="apod-card" 
          style="cursor:pointer; border:1px solid #ccc; padding:8px; border-radius:8px; background:#fafafa;"
          data-index="${idx}">
          <img src="${item.url}" alt="${item.title}" style="width:100%;height:160px;object-fit:cover;border-radius:4px;" />
          <h4 style="margin:8px 0 4px 0;">${item.title}</h4>
          <p style="margin:0;font-size:0.9em;color:#555;">${item.date}</p>
        </div>
      `;
    }
  });
  html += '</div>';

  gallery.innerHTML = html;
  loadingMsg.style.display = 'none';

  // Add click event to each card to show modal
  const cards = gallery.querySelectorAll('.apod-card');
  cards.forEach(card => {
    card.addEventListener('click', () => {
      const idx = parseInt(card.getAttribute('data-index'));
      const item = images[idx];

      // Show modal with full image or embedded video and description
      let mediaHtml = '';
      if (isVideo(item)) {
        // Embed YouTube or Vimeo video
        let embedUrl = item.url;
        if (item.url.includes('youtube.com')) {
          // Convert to embed URL
          const urlParams = new URLSearchParams(item.url.split('?')[1]);
          const videoId = urlParams.get('v');
          if (videoId) {
            embedUrl = `https://www.youtube.com/embed/${videoId}`;
          }
        } else if (item.url.includes('youtu.be')) {
          const videoId = item.url.split('/').pop();
          embedUrl = `https://www.youtube.com/embed/${videoId}`;
        } else if (item.url.includes('vimeo.com')) {
          const videoId = item.url.split('/').pop();
          embedUrl = `https://player.vimeo.com/video/${videoId}`;
        }
        mediaHtml = `
          <div style="width:100%;height:340px;display:flex;align-items:center;justify-content:center;">
            <iframe src="${embedUrl}" width="100%" height="320" frameborder="0" allowfullscreen style="border-radius:8px;"></iframe>
          </div>
        `;
      } else {
        // Show image
        mediaHtml = `
          <img src="${item.url}" alt="${item.title}" style="max-width:100%;height:auto;border-radius:4px;margin-bottom:16px;" />
        `;
      }

      modalContent.innerHTML = `
        <button style="position:absolute;top:10px;right:16px;font-size:2rem;background:none;border:none;cursor:pointer;color:#fc3d21;">×</button>
        <h2 style="margin-bottom:16px;">${item.title}</h2>
        ${mediaHtml}
        <p><strong>Date:</strong> ${item.date}</p>
        <p style="margin-top:12px;">${item.explanation}</p>
      `;
      // Re-add close button event
      const modalCloseBtn = modalContent.querySelector('button');
      modalCloseBtn.addEventListener('click', closeModal);

      modal.style.display = 'flex';
    });
  });
}

getImageBtn.addEventListener('click', () => {
  const startDate = dateSelect.value;
  fetchApodImages(startDate);
});