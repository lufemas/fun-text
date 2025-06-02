/**
 * Fun Text Library v1.3 by lufemas
 *
 * Description:
 * A JavaScript library to apply a "fun text" effect to HTML elements.
 * This library works in conjunction with fun-text-library.css.
 *
 * Features include:
 * - Customizable base class name for targeting elements.
 * - Customizable font family (applied via JS, user handles CSS @import for web fonts).
 * - Letter-by-letter appearance animation (bounce-in).
 * - Continuous "wiggle" animation after appearance.
 * - Controllable "smoothness" (choppiness) of the wiggle animation.
 *
 * How to Use:
 * 1. Include the fun-text-library.css file in the <head> of your HTML:
 * <link rel="stylesheet" href="path/to/fun-text-library.css">
 * 2. Include this fun-text-library.js script in your HTML file (e.g., before </body>).
 * 3. If using a web font (like Google Fonts), ensure you have the @import or <link> for it in your main CSS or HTML <head>.
 * 4. In your HTML, add the base class (e.g., 'fun-text') to the container elements
 * whose text content you want to animate.
 * 5. Optionally, add modifier classes for "appear-by-letter" and "smoothness"
 * (e.g., 'appear-by-letter', 'smoothness-0') as defined in your CSS or library options.
 * 6. After the DOM is loaded, create an instance of the FunText class and call its init() method:
 *
 * Example:
 * ```html
 * * <link rel="stylesheet" href="fun-text-library.css">
 * <link href="[https://fonts.googleapis.com/css2?family=Gochi+Hand&display=swap](https://fonts.googleapis.com/css2?family=Gochi+Hand&display=swap)" rel="stylesheet"> * ```
 * ```javascript
 * // In your main JS file or a <script> tag
 * document.addEventListener('DOMContentLoaded', () => {
 * const myFunText = new FunText({
 * baseClassName: 'fun-text',           // Required: The main class to target
 * fontFamily: "'Gochi Hand', cursive", // Optional: Font family string, applied inline
 * // Optional: Customize modifier class names if they differ from CSS defaults
 * appearByLetterClassName: 'appear-by-letter',
 * smoothnessPrefix: 'smoothness-',      // e.g., for 'smoothness-0', 'smoothness-1'
 * // Optional: Fine-tune animation parameters
 * appearAnimationDuration: 0.9,       // seconds
 * letterAppearStagger: 0.08,          // seconds
 * pauseAfterAppear: 1.5,              // seconds
 * // Optional: Default wiggle animation properties
 * defaultWiggleTimingFunction: 'ease-in-out',
 * wiggleAnimationDurationMin: 1.3,    // seconds
 * wiggleAnimationDurationMax: 2.3,    // seconds
 * wiggleAnimationDelayMax: 0.5        // seconds
 * });
 * myFunText.init();
 *
 * // Example of another instance
 * const anotherInstance = new FunText({
 * baseClassName: 'custom-animated-text',
 * fontFamily: "'Patrick Hand', cursive",
 * appearByLetterClassName: 'show-letters',
 * smoothnessPrefix: 'speed-'
 * });
 * anotherInstance.init();
 * });
 * ```
 */
class FunText {
    constructor(options = {}) {
        const defaults = {
            baseClassName: 'fun-text',
            fontFamily: null, // User should import fonts via CSS. This can override.
            appearByLetterClassName: 'appear-by-letter', // Must match CSS
            smoothnessPrefix: 'smoothness-',             // Must match CSS
            appearAnimationDuration: 0.9,
            letterAppearStagger: 0.08,
            pauseAfterAppear: 1.5,
            defaultWiggleTimingFunction: 'ease-in-out',
            wiggleAnimationDurationMin: 1.3,
            wiggleAnimationDurationMax: 2.3,
            wiggleAnimationDelayMax: 0.5,
            charSpanClassSuffix: '-char-span', // Unique suffix for generated character spans
        };

        this.options = { ...defaults, ...options };
        // The class for individual character spans will be more specific to avoid conflicts
        this.charSpanClass = `${this.options.baseClassName}${this.options.charSpanClassSuffix}`;
    }

    init() {
        const elementsToAnimate = document.querySelectorAll(`.${this.options.baseClassName}`);

        elementsToAnimate.forEach(containerElement => {
            // Apply custom font family if specified
            if (this.options.fontFamily) {
                containerElement.style.fontFamily = this.options.fontFamily;
            }
            this._processContainer(containerElement);
        });
    }

    _processContainer(containerElement) {
        let charIndex = 0;
        const characterSpans = []; // To store all char spans for this container

        let wiggleTimingFunction = this.options.defaultWiggleTimingFunction;
        // Determine smoothness based on classes on the container
        for (let i = 0; i < 5; i++) { // Check for smoothness-0 to smoothness-4 (or speed-0 etc.)
            if (containerElement.classList.contains(`${this.options.smoothnessPrefix}${i}`)) {
                 if (i === 0) wiggleTimingFunction = "steps(1, end)";
                 else if (i === 1) wiggleTimingFunction = "steps(2, end)";
                 else wiggleTimingFunction = `steps(${i*2}, end)`; // More steps for higher numbers
                break;
            }
        }

        const isAppearByLetter = containerElement.classList.contains(this.options.appearByLetterClassName);

        // Recursive function to process nodes
        const collectAndApply = (element) => {
            Array.from(element.childNodes).forEach(node => {
                if (node.nodeType === Node.TEXT_NODE) {
                    if (node.nodeValue.trim() !== '') {
                        const fragment = document.createDocumentFragment();
                        node.nodeValue.split('').forEach(char => {
                            if (char.trim() === '') {
                                fragment.appendChild(document.createTextNode(char));
                            } else {
                                const span = document.createElement('span');
                                span.className = this.charSpanClass; // Use the specific class for spans
                                span.textContent = char;
                                characterSpans.push(span); // Add to list

                                if (isAppearByLetter) {
                                    this._applyAppearAnimation(span, charIndex);
                                } else {
                                    this._applyWiggleAnimation(span, wiggleTimingFunction, true);
                                }
                                fragment.appendChild(span);
                                charIndex++;
                            }
                        });
                        if (node.parentNode) {
                            node.parentNode.replaceChild(fragment, node);
                        }
                    }
                } else if (node.nodeType === Node.ELEMENT_NODE) {
                    // Avoid re-processing our own spans or other specific elements like labels
                    if (!node.classList.contains(this.charSpanClass) && !node.classList.contains('example-label')) {
                        collectAndApply(node);
                    }
                }
            });
        };

        collectAndApply(containerElement);

        if (isAppearByLetter && characterSpans.length > 0) {
            // Calculate total time for all letters to appear
            const totalAppearDuration = (charIndex - 1) * this.options.letterAppearStagger + this.options.appearAnimationDuration;
            
            setTimeout(() => {
                characterSpans.forEach(span => {
                    // Switch to wiggle animation
                    this._applyWiggleAnimation(span, wiggleTimingFunction, false);
                });
            }, (totalAppearDuration + this.options.pauseAfterAppear) * 1000);
        }
    }

    _applyAppearAnimation(span, localCharIndex) {
        // These class names 'letter-bounce-in' and 'fun-text-wiggle' must match those in fun-text-library.css
        span.style.animationName = 'letterBounceIn'; // Fixed name from CSS
        span.style.animationDuration = `${this.options.appearAnimationDuration}s`;
        // Note: animation-timing-function for bounce-in is defined in CSS
        span.style.animationFillMode = 'forwards';
        span.style.animationDelay = `${localCharIndex * this.options.letterAppearStagger}s`;
        span.style.animationIterationCount = '1';
        // Opacity is handled by the initial state in CSS for .appear-by-letter containers
    }

    _applyWiggleAnimation(span, timingFunction, isInitialSetup) {
        span.style.opacity = '1'; // Ensure visible for wiggle
        span.style.animationName = 'funTextWiggle'; // Fixed name from CSS
        span.style.animationTimingFunction = timingFunction;

        const randomDelay = isInitialSetup ? Math.random() * this.options.wiggleAnimationDelayMax : Math.random() * 0.3; // Shorter delay when switching
        const randomDuration = this.options.wiggleAnimationDurationMin + Math.random() * (this.options.wiggleAnimationDurationMax - this.options.wiggleAnimationDurationMin);

        span.style.animationDelay = `${randomDelay.toFixed(2)}s`;
        span.style.animationDuration = `${randomDuration.toFixed(2)}s`;
        span.style.animationIterationCount = 'infinite';
        span.style.animationFillMode = 'none'; // Reset fill mode for wiggle
    }
}
