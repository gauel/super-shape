class SuperShape extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({ mode: "open" });
		this.shadowRoot.innerHTML = `
			<style>
				:host(super-shape) {
					display: block;
					position: relative;
				}
				:host(super-shape) svg {
					width: 100%;
					height: 100%;
					display: block;
					position: absolute;
					inset: 0;
					z-index: 0;
				}
				:host(super-shape) path {
					fill: url(#super-shape-bg-gradient);
					stroke: url(#super-shape-border-gradient);
					stroke-width: var(--super-shape-border-width, 0px);
					vector-effect: non-scaling-stroke;
				}
				
				/* bg gradient */
				:host(super-shape) #super-shape-bg-gradient stop:first-child {
					stop-color: var(--super-shape-bg-from, var(--super-shape-bg));
				}
				
				:host(super-shape) #super-shape-bg-gradient stop:last-child {
					stop-color: var(--super-shape-bg-to, var(--super-shape-bg));
				}
				
				/* stroke gradient */
				:host(super-shape) #super-shape-border-gradient stop:first-child {
					stop-color: var(--super-shape-border-from, var(--super-shape-border));
				}
				
				:host(super-shape) #super-shape-border-gradient stop:last-child {
					stop-color: var(--super-shape-border-to, var(--super-shape-border));
				}
			</style>
			<svg
				viewBox="0 0 0 0"
				preserveAspectRatio="none"
				style="width:100%;
				height:100%;
				"
			>
				<path d=""></path>
				<linearGradient
					x1="0%"
					y1="0%"
					x2="100%"
					y2="100%"
					id="super-shape-border-gradient"
					>
				  <stop offset="0%" />
				  <stop offset="100%" />
				</linearGradient>
				<linearGradient
					x1="0%"
					y1="0%"
					x2="100%"
					y2="100%"
					id="super-shape-bg-gradient"
					>
				  <stop offset="0%" />
				  <stop offset="100%" />
				</linearGradient>
			</svg>
			<div class="super-shape-content" style="z-index:1;position:relative;width:100%;height:100%">
				<slot></slot>
			</div>`;
	}

	connectedCallback() {
		this.updateShape();
		window.addEventListener("resize", () => this.updateShape());
	}

	disconnectedCallback() {
		window.removeEventListener("resize", () => this.updateShape());
	}

	static get observedAttributes() {
		return [
			"tl",
			"tr",
			"bl",
			"br",
			"border",
			"border-from",
			"border-to",
			"border-width",
			"bg",
			"bg-from",
			"bg-to",
		];
	}

	attributeChangedCallback(name, oldValue, newValue) {
		this.style.setProperty(`--super-shape-${name}`, newValue);
		this.updateShape();
	}

	updateShape() {
		const svg = this.shadowRoot.querySelector("svg");
		const path = this.shadowRoot.querySelector("path");
		const rect = this.getBoundingClientRect();

		svg.setAttribute("viewBox", `0 0 ${rect.width} ${rect.height}`);

		const strokeWidth = parseInt(this.getAttribute("border-width") || 0);
		const adjust = strokeWidth / 2;

		const tl = parseFloat(this.getAttribute("tl") || 0);
		const tr = parseFloat(this.getAttribute("tr") || 0);
		const br = parseFloat(this.getAttribute("br") || 0);
		const bl = parseFloat(this.getAttribute("bl") || 0);

		const d = `
            M ${tl + adjust},${adjust} 
            L ${rect.width - tr - adjust},${adjust} 
            L ${rect.width - adjust},${tr + adjust} 
            L ${rect.width - adjust},${rect.height - br - adjust}
            L ${rect.width - br - adjust},${rect.height - adjust}
            L ${bl + adjust},${rect.height - adjust}
            L ${adjust},${rect.height - bl - adjust}
            L ${adjust},${tl + adjust} 
            Z
        `;

		path.setAttribute("d", d);
	}
}

customElements.define('super-shape', SuperShape);