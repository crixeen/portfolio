/* ============================================================
   form-validation.js
   Validaciones y restricciones para el formulario de contacto
   ============================================================ */

(() => {
	'use strict';

	// ─── Configuración ───────────────────────────────────────────
	const CONFIG = {
		fields: {
			nombre: { min: 2, max: 50, required: true },
			empresa: { min: 2, max: 80, required: false },
			email: { min: 5, max: 100, required: true },
			asunto: { min: 5, max: 100, required: false },
			mensaje: { min: 20, max: 800, required: true },
		},
		rateLimit: {
			maxAttempts: 3, // intentos de envío permitidos
			windowMs: 60 * 1000, // ventana de 60 segundos
		},
		bannedWords: ['casino', 'viagra', 'crypto', 'bitcoin', 'forex', 'click here', 'free money', 'make money fast'],
		// Campos donde no se permite pegar
		noPasteFields: ['email'],
	};

	// ─── Estado de rate limit ─────────────────────────────────────
	const rateState = { attempts: 0, resetAt: null };

	// ─── Utilidades ──────────────────────────────────────────────
	const $ = (sel, ctx = document) => ctx.querySelector(sel);
	const stripHtml = (str) => str.replace(/<[^>]*>/g, '');
	const normalize = (str) => str.trim().toLowerCase();

	function showError(input, msg) {
		input.classList.add('input-error');
		input.classList.remove('input-ok');
		let err = input.parentElement.querySelector('.field-error');
		if (!err) {
			err = document.createElement('span');
			err.className = 'field-error';
			input.parentElement.appendChild(err);
		}
		err.textContent = msg;
		input.setAttribute('aria-invalid', 'true');
		input.setAttribute('aria-describedby', `err-${input.name}`);
		err.id = `err-${input.name}`;
	}

	function clearError(input) {
		input.classList.remove('input-error');
		input.classList.add('input-ok');
		input.removeAttribute('aria-invalid');
		const err = input.parentElement.querySelector('.field-error');
		if (err) err.textContent = '';
	}

	// ─── Contador de caracteres ───────────────────────────────────
	function attachCounter(input, max) {
		let counter = input.parentElement.querySelector('.char-counter');
		if (!counter) {
			counter = document.createElement('span');
			counter.className = 'char-counter';
			input.parentElement.appendChild(counter);
		}
		const update = () => {
			const len = input.value.length;
			counter.textContent = `${len} / ${max}`;
			counter.classList.toggle('char-counter--warn', len >= max * 0.85);
			counter.classList.toggle('char-counter--limit', len >= max);
		};
		input.addEventListener('input', update);
		update();
	}

	// ─── Bloquear pegar ───────────────────────────────────────────
	function blockPaste(input) {
		input.addEventListener('paste', (e) => {
			e.preventDefault();
			showError(input, 'No se permite pegar en este campo. Escríbelo manualmente.');
		});
	}

	// ─── Bloquear caracteres especiales / HTML ────────────────────
	function blockSpecialChars(input, allowedPattern) {
		input.addEventListener('input', () => {
			const original = input.value;
			// Elimina etiquetas HTML
			const sanitized = stripHtml(original);
			if (sanitized !== original) {
				input.value = sanitized;
				showError(input, 'No se permiten etiquetas HTML.');
			}
			// Aplica patrón extra si se define
			if (allowedPattern && !allowedPattern.test(input.value) && input.value !== '') {
				input.value = input.value.replace(allowedPattern, '');
			}
		});
	}

	// ─── Reglas de validación ─────────────────────────────────────
	const RULES = {
		nombre(val) {
			const { min, max } = CONFIG.fields.nombre;
			if (!val.trim()) return 'El nombre es obligatorio.';
			if (val.trim().length < min) return `Mínimo ${min} caracteres.`;
			if (val.trim().length > max) return `Máximo ${max} caracteres.`;
			if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s''-]+$/.test(val.trim())) return 'Solo se permiten letras y espacios.';
			if (val === val.toUpperCase() && val.trim().length > 3) return 'Por favor, no escribas todo en mayúsculas.';
			return null;
		},

		empresa(val) {
			if (!val.trim()) return null; // opcional
			const { min, max } = CONFIG.fields.empresa;
			if (val.trim().length < min) return `Mínimo ${min} caracteres.`;
			if (val.trim().length > max) return `Máximo ${max} caracteres.`;
			if (/<[^>]*>/.test(val)) return 'No se permiten etiquetas HTML.';
			return null;
		},

		email(val) {
			const { max } = CONFIG.fields.email;
			if (!val.trim()) return 'El email es obligatorio.';
			if (val.trim().length > max) return `Máximo ${max} caracteres.`;
			if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(val.trim())) return 'Ingresa un email válido (ej: tu@empresa.com).';
			// Dominios desechables comunes
			const disposable = ['mailinator.com', 'tempmail.com', 'guerrillamail.com', '10minutemail.com', 'trashmail.com'];
			const domain = val.trim().split('@')[1]?.toLowerCase();
			if (disposable.includes(domain)) return 'No se aceptan correos temporales o desechables.';
			return null;
		},

		asunto(val) {
			if (!val.trim()) return null; // opcional
			const { min, max } = CONFIG.fields.asunto;
			if (val.trim().length < min) return `Mínimo ${min} caracteres.`;
			if (val.trim().length > max) return `Máximo ${max} caracteres.`;
			if (/<[^>]*>/.test(val)) return 'No se permiten etiquetas HTML.';
			return null;
		},

		mensaje(val) {
			const { min, max } = CONFIG.fields.mensaje;
			if (!val.trim()) return 'El mensaje es obligatorio.';
			if (val.trim().length < min) return `El mensaje debe tener al menos ${min} caracteres (${val.trim().length}/${min}).`;
			if (val.trim().length > max) return `Máximo ${max} caracteres.`;
			if (/<[^>]*>/.test(val)) return 'No se permiten etiquetas HTML.';
			// Detectar spam por palabras prohibidas
			const lower = normalize(val);
			const found = CONFIG.bannedWords.find((w) => lower.includes(w));
			if (found) return `El mensaje contiene contenido no permitido ("${found}").`;
			// Todo en mayúsculas
			const letters = val.replace(/[^a-zA-Z]/g, '');
			if (letters.length > 10 && letters === letters.toUpperCase()) return 'Por favor, no escribas el mensaje en mayúsculas.';
			return null;
		},
	};

	// ─── Inyectar estilos ─────────────────────────────────────────
	function injectStyles() {
		if ($('#fv-styles')) return;
		const style = document.createElement('style');
		style.id = 'fv-styles';
		style.textContent = `
      .form-input.input-error,
      .form-textarea.input-error {
        border-color: #e05c5c !important;
        box-shadow: 0 0 0 2px rgba(224,92,92,.15);
      }
      .form-input.input-ok,
      .form-textarea.input-ok {
        border-color: #4a7c59 !important;
      }
      .field-error {
        color: #e05c5c;
        font-size: .75rem;
        margin-top: .3rem;
        display: block;
        animation: fv-fadein .2s ease;
      }
      .char-counter {
        display: block;
        text-align: right;
        font-size: .72rem;
        color: #888;
        margin-top: .25rem;
        transition: color .2s;
      }
      .char-counter--warn  { color: #d4900a; }
      .char-counter--limit { color: #e05c5c; font-weight: 600; }
      .form-submit:disabled { opacity: .65; cursor: not-allowed; }
      .fv-banner {
        background: #e05c5c22;
        border: 1px solid #e05c5c88;
        color: #e05c5c;
        border-radius: 6px;
        padding: .7rem 1rem;
        font-size: .82rem;
        margin-bottom: 1rem;
        display: none;
      }
      .fv-banner.visible { display: block; animation: fv-fadein .25s ease; }
      @keyframes fv-fadein {
        from { opacity: 0; transform: translateY(-4px); }
        to   { opacity: 1; transform: translateY(0);    }
      }
    `;
		document.head.appendChild(style);
	}

	// ─── Banner de error global ───────────────────────────────────
	function getOrCreateBanner(form) {
		let banner = form.querySelector('.fv-banner');
		if (!banner) {
			banner = document.createElement('div');
			banner.className = 'fv-banner';
			banner.setAttribute('role', 'alert');
			form.prepend(banner);
		}
		return banner;
	}

	function showBanner(form, msg) {
		const b = getOrCreateBanner(form);
		b.textContent = msg;
		b.classList.add('visible');
	}

	function hideBanner(form) {
		const b = form.querySelector('.fv-banner');
		if (b) b.classList.remove('visible');
	}

	// ─── Rate limit ───────────────────────────────────────────────
	function checkRateLimit() {
		const now = Date.now();
		if (rateState.resetAt && now > rateState.resetAt) {
			rateState.attempts = 0;
			rateState.resetAt = null;
		}
		if (rateState.attempts >= CONFIG.rateLimit.maxAttempts) {
			const secsLeft = Math.ceil((rateState.resetAt - now) / 1000);
			return `Demasiados intentos. Espera ${secsLeft}s antes de volver a enviar.`;
		}
		return null;
	}

	function registerAttempt() {
		rateState.attempts++;
		if (!rateState.resetAt) {
			rateState.resetAt = Date.now() + CONFIG.rateLimit.windowMs;
		}
	}

	// ─── Init ─────────────────────────────────────────────────────
	function init() {
		const form = $('#contactForm');
		const btn = $('#formSubmitBtn');
		if (!form || !btn) return;

		injectStyles();

		// Adjuntar contadores, bloqueo de pegado y saneamiento por campo
		Object.entries(CONFIG.fields).forEach(([name, cfg]) => {
			const el = form.querySelector(`[name="${name}"]`);
			if (!el) return;

			// Contador de caracteres
			attachCounter(el, cfg.max);

			// Bloquear pegar
			if (CONFIG.noPasteFields.includes(name)) blockPaste(el);

			// Bloquear HTML / caracteres peligrosos
			blockSpecialChars(el);

			// Deshabilitar autocompletado en campos sensibles
			if (['mensaje', 'asunto'].includes(name)) el.setAttribute('autocomplete', 'off');

			// Maxlength nativo como respaldo
			el.setAttribute('maxlength', cfg.max);

			// Validación blur (tiempo real al salir del campo)
			el.addEventListener('blur', () => {
				if (!RULES[name]) return;
				const error = RULES[name](el.value);
				error ? showError(el, error) : clearError(el);
			});

			// Limpiar error mientras escribe
			el.addEventListener('input', () => {
				if (el.classList.contains('input-error') && RULES[name]) {
					if (!RULES[name](el.value)) clearError(el);
				}
			});
		});

		// ── Submit ──────────────────────────────────────────────────
		form.addEventListener('submit', async (e) => {
			e.preventDefault();
			hideBanner(form);

			// Rate limit
			const rlError = checkRateLimit();
			if (rlError) {
				showBanner(form, rlError);
				return;
			}

			// Honeypot (campo oculto bot-field)
			const honeypot = form.querySelector('[name="bot-field"]');
			if (honeypot && honeypot.value) {
				// Silencioso: aparenta éxito sin enviar
				form.reset();
				return;
			}

			// Validar todos los campos
			let firstInvalid = null;
			let allValid = true;

			Object.keys(RULES).forEach((name) => {
				const el = form.querySelector(`[name="${name}"]`);
				if (!el) return;
				const error = RULES[name](el.value);
				if (error) {
					showError(el, error);
					allValid = false;
					if (!firstInvalid) firstInvalid = el;
				} else {
					clearError(el);
				}
			});

			if (!allValid) {
				showBanner(form, 'Por favor, corrige los errores antes de enviar.');
				firstInvalid?.focus();
				firstInvalid?.scrollIntoView({ behavior: 'smooth', block: 'center' });
				return;
			}

			// Registrar intento antes del fetch
			registerAttempt();

			const originalText = btn.textContent;
			btn.textContent = 'Enviando…';
			btn.disabled = true;

			try {
				await fetch('/', { method: 'POST', body: new FormData(form) });

				form.reset();
				form.querySelectorAll('.input-ok').forEach((el) => el.classList.remove('input-ok'));
				form.querySelectorAll('.char-counter').forEach((c) => {
					c.textContent = `0 / ${c.textContent.split('/')[1]?.trim()}`;
					c.className = 'char-counter';
				});

				btn.textContent = '✓ Mensaje enviado';
				btn.style.background = '#4a7c59';

				setTimeout(() => {
					btn.textContent = originalText;
					btn.disabled = false;
					btn.style.background = '';
					// Reiniciar rate limit en envío exitoso
					rateState.attempts = 0;
					rateState.resetAt = null;
				}, 3000);
			} catch {
				showBanner(form, 'Ocurrió un error al enviar. Intenta de nuevo.');
				btn.textContent = originalText;
				btn.disabled = false;
			}
		});
	}

	// Ejecutar cuando el DOM esté listo
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init);
	} else {
		init();
	}
})();
