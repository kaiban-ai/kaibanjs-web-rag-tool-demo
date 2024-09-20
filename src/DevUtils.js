const injectStyles = () => {
    const style = document.createElement('style');
    style.textContent = `
      .api-error-container {
        color: #0f172a;
        text-align: center;
      }
      
      .error-title {
        font-size: 1.5rem;
        font-weight: bold;
        margin-bottom: 0;
      }
  
      .error-info {
        width: 75%; 
        font-size: 1rem;
        color: #64748b;
        margin: 0 auto;
        margin-top: 0.75rem;
        margin-bottom: 1.5rem;
      }
      
      .error-list {
        list-style-type: none;
        padding: 0;
      }
      
      .error-item {
        padding: 1rem;
        background-color: #fff;
        border-radius: 0.75rem;
        box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.05), 0 4px 6px -4px rgb(0 0 0 / 0.05);
        color: #64748b;
        text-align: left;
        display: grid;
        grid-template-columns: 40px 190px repeat(3, 1fr);
        gap: 1rem;
        align-items: start;
        margin-bottom: .75rem;
      }
  
      .error-item-idx {
        height: 100%;
        background-color: #fef2f2;
        color: #ef4444;
        border-radius: 0.375rem;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .error-item-title {
        font-size: 1rem;
        font-weight: bold;
        color: #0f172a;
      }
      
      .detail-label {
        font-weight: 600;
        color: #0f172a;
      }
      
      .error-link {
        color: #7dd3fc;
      }
  
      .error-link:hover {
        color: #38bdf8;
      }
      
      .support-text {
        color: #64748b;
        margin: 0;
        margin-top: 6px;
        font-size: 0.875rem;
      }
  
      .support-text span {
        font-weight: 600;
      }
      
      .support-link {
        color: #7dd3fc;
        font-weight: 500;
      }
  
      .support-link:hover {
        color: #38bdf8;
      }
  
      @media (max-width: 1024px) {
        .error-item {
          grid-template-columns: 40px 1fr;
          grid-template-rows: auto;
          gap: 0.75rem;
          align-items: center;
        }
  
        .error-item > *:nth-child(n+3) {
          grid-column: 1 / -1;
        }
  
        .error-item-idx {
          height: 40px;
        }
      }
    `;
    document.head.appendChild(style);
}

const showApiKeyError = (missingKeys) => {
    injectStyles();

    const errorContainer = document.createElement('div');
    errorContainer.classList.add('container', 'api-error-container');

    errorContainer.innerHTML = `
      <p class="error-title">The following API key(s) are missing</p>
      <p class="error-info">
              To fully experience the capabilities of KaibanJs, please configure the environment variables in the .env file by setting the keys listed below. This setup is essential to run the example successfully. If you have any questions or feedback, feel free to reach out to us.
      </p>
      <ul class="error-list">
        ${missingKeys.map((key, idx) => `
          <li class="error-item">
            <div class="error-item-idx">${idx + 1}</div>
            <div class="error-item-title">${key.name}</div>
            <div>
              <span class="detail-label">Purpose:</span> ${key.purpose}
            </div>
            <div>
              <span class="detail-label">Where to put it:</span> ${key.projectLocation}
            </div>
            <div>
              <span class="detail-label">Get the value here:</span> <a href="${key.valueLocation}" target="_blank" class="error-link">${key.valueLocation}</a>
            </div>
          </li>
        `).join('')}
      </ul>
      <p class="support-text">Please add the missing key(s) to continue.</p>
      <p class="support-text"><span>Need help?</span> Join our <a href="https://kaibanjs.com/discord" target="_blank" class="support-link">Discord support channel</a>.</p>
    `;

    document.body.appendChild(errorContainer);
}

const DevUtils = () => {
    const missingKeys = [];

    if (!import.meta.env.VITE_OPENAI_API_KEY) {
        missingKeys.push({
            name: 'VITE_OPENAI_API_KEY',
            purpose: 'Used for generating AI responses and processing natural language queries.',
            projectLocation: 'In the .env file on the root of the project: VITE_OPENAI_API_KEY=your-api-key-value',
            valueLocation: 'https://platform.openai.com/account/api-keys'
        });
    }

    if (missingKeys.length > 0) {
        showApiKeyError(missingKeys);
    }
}

DevUtils();

export default DevUtils;
