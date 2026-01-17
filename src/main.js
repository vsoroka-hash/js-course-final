import {
  loadExerciseCards,
  updateBreadcrumbs,
  initSearch,
  initCardsEventListener,
} from './js/exercises.js';
import { initExerciseModal } from './js/exercise-modal.js';
import { initRatingModal } from './js/rating-modal.js';
import {
  initGlobalNotification,
  showGlobalNotification,
} from './js/global-notification.js';
import {
  showFieldError,
  hideFieldError,
  validateEmail,
} from './js/form-validation.js';
import { initHeader } from './js/header.js';
import { displayQuote } from './js/quote.js';

// Load and display quote of the day
displayQuote();

// Функція для відправки запиту на оформлення підписки
async function subscribeToNewsletter(email) {
  try {
    const response = await fetch(
      'https://your-energy.b.goit.study/api/subscription',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
        }),
      }
    );

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const errorMessage =
        data.message || 'Failed to subscribe. Please try again later.';
      throw new Error(errorMessage);
    }
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Початкове завантаження та ініціалізація
document.addEventListener('DOMContentLoaded', () => {
  // Ініціалізація модалок
  initExerciseModal();
  initRatingModal();

  // Ініціалізація глобальних повідомлень
  initGlobalNotification();

  // Ініціалізація хедера
  initHeader();

  // Ініціалізація пошуку
  initSearch();

  // Ініціалізація слухача подій на контейнері карток (event delegation)
  initCardsEventListener();

  // Початкове завантаження карток
  loadExerciseCards('Muscles', 1);

  // ??????? ?????? ?? ??????? ????? ???????????
  const filtersContainer = document.querySelector(
    '.exercises__content__header-filters'
  );
  if (filtersContainer) {
    filtersContainer.addEventListener('click', event => {
      const button = event.target.closest(
        '.exercises__content__header-filters-item'
      );
      if (!button) {
        return;
      }

      const filterButtons = filtersContainer.querySelectorAll(
        '.exercises__content__header-filters-item'
      );
      filterButtons.forEach(btn =>
        btn.classList.remove('exercises__content__header-filters-item--active')
      );

      button.classList.add('exercises__content__header-filters-item--active');

      const filter = button.getAttribute('data-filter');
      updateBreadcrumbs(null);
      loadExerciseCards(filter, 1);
    });
  }

  // Обробка форми підписки
  const subscribeForm = document.getElementById('subscribeForm');
  const subscribeEmailInput = document.getElementById('subscribeEmail');
  const subscribeEmailError = document.getElementById('subscribeEmailError');

  // Clear error on input
  if (subscribeEmailInput && subscribeEmailError) {
    subscribeEmailInput.addEventListener('input', () => {
      hideFieldError(subscribeEmailInput, subscribeEmailError);
    });
  }

  if (subscribeForm) {
    subscribeForm.addEventListener('submit', async e => {
      e.preventDefault();

      const email = subscribeEmailInput?.value.trim() || '';
      let hasErrors = false;

      // Validate email
      if (!email) {
        showFieldError(
          subscribeEmailInput,
          subscribeEmailError,
          'Please enter your email address'
        );
        hasErrors = true;
      } else if (!validateEmail(email)) {
        showFieldError(
          subscribeEmailInput,
          subscribeEmailError,
          'Please enter a valid email address'
        );
        hasErrors = true;
      } else {
        hideFieldError(subscribeEmailInput, subscribeEmailError);
      }

      // Stop if there are errors
      if (hasErrors) {
        return;
      }

      const result = await subscribeToNewsletter(email);

      if (result.success) {
        showGlobalNotification(result.data.message, 'success');
        subscribeForm.reset();
        hideFieldError(subscribeEmailInput, subscribeEmailError);
      } else {
        showGlobalNotification(result.error, 'error');
      }
    });
  }
});
