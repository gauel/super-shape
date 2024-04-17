class SuperShape extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
			@import "./super-shape-styles.css";
            </style>
            <svg width="100%" height="100%">
                <polygon points="0,0 100,0 100,100 0,100"
                         style="fill: var(--gradient); stroke: var(--stroke-color, black); stroke-width: var(--stroke-width, 2);">
                </polygon>
            </svg>
        `;
        this.resizeObserver = new ResizeObserver(entries => {
            for (let entry of entries) {
                this.updateCorners(entry.contentRect.width, entry.contentRect.height);
            }
        });
    }

    connectedCallback() {
        this.resizeObserver.observe(this.shadowRoot.querySelector('svg'));
    }

    disconnectedCallback() {
        this.resizeObserver.disconnect();
    }

    static get observedAttributes() {
        return ['skew-tl', 'skew-tr', 'skew-bl', 'skew-br', 'stroke-color', 'stroke-width', 'gradient-start', 'gradient-end'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        this.style.setProperty(`--${name}`, newValue);
        this.updateCorners();
    }

    updateCorners(width = this.shadowRoot.querySelector('svg').clientWidth, height = this.shadowRoot.querySelector('svg').clientHeight) {
        const polygon = this.shadowRoot.querySelector('polygon');
        const skewTL = parseInt(this.getAttribute('skew-tl') || 0);
        const skewTR = parseInt(this.getAttribute('skew-tr') || 0);
        const skewBR = parseInt(this.getAttribute('skew-br') || 0);
        const skewBL = parseInt(this.getAttribute('skew-bl') || 0);

        const points = [
            `${skewTL},${skewTL}`,  // Adjust top-left corner inward
            `${width - skewTR},${skewTR}`, // Adjust top-right corner inward
            `${width - skewBR},${height - skewBR}`, // Adjust bottom-right corner inward
            `${skewBL},${height - skewBL}` // Adjust bottom-left corner inward
        ].join(' ');

        polygon.setAttribute('points', points);
    }
}

customElements.define("super-shape", SuperShape);
