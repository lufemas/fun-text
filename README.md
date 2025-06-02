# Fun Text Library by lufemas v1.3

A JavaScript library to apply a "fun text" effect to HTML elements, reminiscent of classic video game text animations (like a score board of a 16-bit retro game about a baby and a dino) . This library works with an accompanying CSS file (`fun-text-library.css`) to bring your text to life!

## Features

* **Easy Integration**: Link a CSS file and a JS file.
* **Customizable Base Class**: Target specific text containers.
* **Font Flexibility**: Use any font you like; the library can apply `font-family` via JavaScript. Ensure web fonts are imported in your HTML/CSS.
* **Letter-by-Letter Appearance**: Animate text with a "bounce-in" effect for each letter.
* **Wiggle Animation**: After appearing, letters can have a continuous, lively "wiggle".
* **Adjustable Smoothness**: Control the choppiness of the wiggle animation (from smooth to step-by-step).
* **Multiple Instances**: Use different configurations for different text blocks on the same page.

## Files

* `fun-text-library.js`: The core JavaScript logic.
* `fun-text-library.css`: Contains all necessary CSS keyframes and base styles for the animations.

## How to Use

1.  **Include Files**:
    * Place `fun-text-library.css` and `fun-text-library.js` in your project (e.g., in an `assets/` or `lib/` directory).
    * Link the CSS file in the `<head>` of your HTML:
        ```html
        <link rel="stylesheet" href="path/to/fun-text-library.css">
        ```
    * Include the JavaScript file, typically before the closing `</body>` tag:
        ```html
        <script src="path/to/fun-text-library.js"></script>
        ```

2.  **Import Fonts (If Using Web Fonts)**:
    * If you're using a web font (like Google Fonts), make sure to import it in your main CSS file or link it in your HTML `<head>`.
        ```html
        <link rel="preconnect" href="[https://fonts.googleapis.com](https://fonts.googleapis.com)">
        <link rel="preconnect" href="[https://fonts.gstatic.com](https://fonts.gstatic.com)" crossorigin>
        <link href="[https://fonts.googleapis.com/css2?family=Gochi+Hand&display=swap](https://fonts.googleapis.com/css2?family=Gochi+Hand&display=swap)" rel="stylesheet">
        ```

3.  **Prepare Your HTML**:
    * Add a base class (e.g., `fun-text`) to the container elements whose text content you want to animate.
    * Optionally, add modifier classes to enable specific features:
        * **Appear by Letter**: Add a class like `appear-by-letter` (this is configurable).
        * **Smoothness/Choppiness**: Add a class like `smoothness-0` (for very choppy) or `smoothness-1` (less choppy). The prefix `smoothness-` is configurable.

    ```html
    <div class="fun-text appear-by-letter smoothness-0">
        <h1>Hello World!</h1>
        <p>This text will animate!</p>
    </div>

    <div class="my-other-style show-em speed-1">
        <h2>Another Example</h2>
    </div>
    ```

4.  **Initialize the Library**:
    * In a `<script>` tag in your HTML (after including `fun-text-library.js`) or in your main JavaScript file, create an instance of the `FunText` class and call its `init()` method. This should be done after the DOM is fully loaded.

    ```javascript
    document.addEventListener('DOMContentLoaded', () => {
        // Instance 1: Using default class names from CSS
        const myFunText = new FunText({
            baseClassName: 'fun-text',           // The main class on your HTML elements
            fontFamily: "'Gochi Hand', cursive", // Optional: JS applies this font-family
                                                 // Ensure 'Gochi Hand' is imported via CSS/link
            // Modifier classes below should match what's in your HTML and CSS
            // (or use defaults if they match fun-text-library.css)
            appearByLetterClassName: 'appear-by-letter',
            smoothnessPrefix: 'smoothness-',
            
            // Optional: Fine-tune animation parameters
            appearAnimationDuration: 0.9,   // seconds for each letter's bounce
            letterAppearStagger: 0.08,      // delay between each letter appearing
            pauseAfterAppear: 1.5,          // seconds before wiggle starts
        });
        myFunText.init();

        // Instance 2: Using custom class names and different font
        const anotherFunStyle = new FunText({
            baseClassName: 'my-other-style',
            fontFamily: "'Comic Sans MS', cursive", // Make sure this font is available
            appearByLetterClassName: 'show-em',    // Custom class for appear effect
            smoothnessPrefix: 'speed-',            // Custom prefix for smoothness
        });
        anotherFunStyle.init();
    });
    ```

## Configuration Options

When creating a `new FunText(options)` instance, you can pass an options object with the following properties:

| Option                       | Type   | Default                      | Description                                                                                                |
| :--------------------------- | :----- | :--------------------------- | :--------------------------------------------------------------------------------------------------------- |
| `baseClassName`              | String | `'fun-text'`                 | **Required.** The main class on HTML elements to target.                                                   |
| `fontFamily`                 | String | `null`                       | CSS `font-family` string. Applied inline by JS. User must ensure font is loaded.                           |
| `appearByLetterClassName`    | String | `'appear-by-letter'`         | Class name on the parent to trigger the letter-by-letter appearance animation. Must match CSS.             |
| `smoothnessPrefix`           | String | `'smoothness-'`              | Prefix for classes that control wiggle choppiness (e.g., `smoothness-0`, `smoothness-1`). Must match CSS.    |
| `appearAnimationDuration`    | Number | `0.9`                        | Duration (seconds) of the bounce-in animation for each letter.                                             |
| `letterAppearStagger`        | Number | `0.08`                       | Delay (seconds) between each letter starting its appearance animation.                                     |
| `pauseAfterAppear`           | Number | `1.5`                        | Pause (seconds) after all letters have appeared before the wiggle animation starts.                        |
| `defaultWiggleTimingFunction`| String | `'ease-in-out'`              | Default CSS `animation-timing-function` for the wiggle if no smoothness class is found.                    |
| `wiggleAnimationDurationMin` | Number | `1.3`                        | Minimum duration (seconds) for the randomized wiggle animation.                                            |
| `wiggleAnimationDurationMax` | Number | `2.3`                        | Maximum duration (seconds) for the randomized wiggle animation.                                            |
| `wiggleAnimationDelayMax`    | Number | `0.5`                        | Maximum initial random delay (seconds) before a character's wiggle animation starts.                       |
| `charSpanClassSuffix`        | String | `'-char-span'`               | Suffix appended to `baseClassName` to create the class for individual character `<span>` elements.         |

## CSS Customization

The `fun-text-library.css` file provides the core animations (`@keyframes funTextWiggle`, `@keyframes letterBounceIn`) and initial states. You can customize:

* The keyframe animations themselves if you want different visual effects.
* The styling for the base container (e.g., `.fun-text`) in your own CSS to set default colors, line heights, etc., that are not managed by the JS `fontFamily` option.
* The CSS selectors for `.appear-by-letter [class$="-char-span"]` if you change the `appearByLetterClassName` option in JS and want the CSS to match without relying solely on the JS for opacity.

Make sure your custom modifier classes in HTML (for `appearByLetter` and `smoothness`) align with what the JavaScript options are configured to look for, and that the CSS provides the necessary initial states (like `opacity: 0`) for these effects if needed.

