# Ripple

A lightweight, globally reusable click ripple effect for the Rapid Fire Math application.

The ripple effect is based on the original CSS/JavaScript implementation and can be added to any clickable element by adding the `ripple` class.

---

## Location

```text
src/components/UI/Ripple/
├── Ripple.jsx
├── ripple.css
└── README.md
```

---

## How It Works

The `Ripple` component installs a single global click listener when it is mounted.

When an element with the `ripple` class is clicked:

1. The clicked element is identified.
2. Any existing ripple on that element is removed.
3. The ripple diameter is calculated from the element's dimensions.
4. The click position is calculated relative to the element.
5. A `<span>` element is created.
6. The `ripple` CSS class is applied.
7. CSS handles the animation.

The animation itself runs entirely through CSS.

---

## Installation

Import the component and stylesheet in the application layout.

```jsx
import Ripple from "@/components/UI/Ripple/Ripple";
import "@/components/UI/Ripple/ripple.css";
```

Then render the component once:

```jsx
<Ripple />
```

For example:

```jsx
export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body>
        <Ripple />
        {children}
      </body>
    </html>
  );
}
```

The `Ripple` component only needs to be rendered once for the entire application.

---

## Usage

After the global component has been installed, simply add `ripple` to the element's class list.

### Button

```jsx
<button className='ripple'>Start Practice</button>
```

### Button with CSS Module

```jsx
<button className={`${styles.button} ripple`}>Start Practice</button>
```

### Link

```jsx
<Link
  href='/practice/add/1'
  className={`${styles.levelCard} ripple`}
>
  Level 1
</Link>
```

### Any Other Element

```jsx
<div className='ripple'>Content</div>
```

---

## CSS Requirements

The element receiving the `ripple` class should normally have:

```css
position: relative;
```

This allows the generated ripple to be positioned relative to the element.

For example:

```css
.button {
  position: relative;
}
```

The ripple implementation does **not** automatically apply `overflow: hidden`.

This is intentional because some elements in the application, such as level cards with tooltips, may need to display content outside their boundaries.

---

## Animation

The animation is based directly on the original ripple implementation.

```css
span.ripple {
  position: absolute;
  border-radius: 50%;
  transform: scale(0);
  animation: ripple 600ms linear;
  background-color: rgba(255, 255, 255, 0.7);
}

@keyframes ripple {
  to {
    transform: scale(4);
    opacity: 0;
  }
}
```

### Animation characteristics

| Property        | Value                      |
| --------------- | -------------------------- |
| Duration        | `600ms`                    |
| Timing          | `linear`                   |
| Initial scale   | `0`                        |
| Final scale     | `4`                        |
| Initial opacity | `1`                        |
| Final opacity   | `0`                        |
| Background      | `rgba(255, 255, 255, 0.7)` |
| Shape           | Circle                     |

The animation values should remain unchanged if the goal is to preserve the original ripple effect.

---

## Global Event Listener

The application uses a single document-level click listener rather than adding an `onClick` handler to every ripple-enabled element.

Conceptually:

```jsx
document.addEventListener("click", createRipple);
```

The handler immediately ignores clicks that do not occur inside an element with the `ripple` class.

```jsx
const element = event.target.closest(".ripple");

if (!element) {
  return;
}
```

This keeps individual components simple:

```jsx
<button className={`${styles.button} ripple`}>Start</button>
```

There is no need to import the Ripple component or add a separate click handler.

---

## Performance

The global listener is lightweight because it only performs useful work when a click occurs.

It does not continuously monitor the page and does not run during the ripple animation.

The 600ms animation is handled by CSS rather than JavaScript.

Only one global event listener is registered for the application.

---

## Important: `overflow`

Do not add:

```css
overflow: hidden;
```

to the global `.ripple` class.

The original ripple demo uses `overflow: hidden` on the button itself, but applying that behavior globally could interfere with components whose content intentionally extends outside their boundaries.

For example, a level card may contain a tooltip positioned outside the card.

If a particular component needs clipping for its ripple, handle that at the component level rather than changing the global ripple behavior.

---

## Why `getBoundingClientRect()` Is Used

The original implementation calculates the click position using:

```jsx
button.offsetLeft;
button.offsetTop;
```

The reusable implementation uses:

```jsx
element.getBoundingClientRect();
```

This provides the element's actual position within the viewport and makes the ripple position more reliable when the element is nested inside other containers, layouts, or positioned elements.

This change affects the positioning calculation only. It does not change the visual ripple animation.

---

## File Structure

```text
src/
└── components/
    └── UI/
        └── Ripple/
            ├── Ripple.jsx
            ├── ripple.css
            └── README.md
```

The component is intentionally kept separate from individual features so it can be reused throughout the application.

---

## Example

A typical component can simply do:

```jsx
<button
  type='button'
  className={`${styles.button} ripple`}
>
  Start Practice
</button>
```

No Ripple import is required in the component using the effect.

The only Ripple import required is at the application level where `<Ripple />` is mounted.
