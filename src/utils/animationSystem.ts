export interface AnimationSettings {
  enabled: boolean;
  duration: {
    reveal: number;
    click: number;
    hover: number;
    ripple: number;
    cascade: number;
  };
  easing: {
    reveal: string;
    click: string;
    hover: string;
    ripple: string;
    cascade: string;
  };
}

export const defaultAnimationSettings: AnimationSettings = {
  enabled: true,
  duration: {
    reveal: 400,
    click: 150,
    hover: 200,
    ripple: 600,
    cascade: 500,
  },
  easing: {
    reveal: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    click: 'ease-out',
    hover: 'ease',
    ripple: 'ease-out',
    cascade: 'ease-out',
  },
};

export class CellAnimationManager {
  private animationSettings: AnimationSettings;
  private animationTimeouts: Map<string, NodeJS.Timeout> = new Map();

  constructor(settings: AnimationSettings = defaultAnimationSettings) {
    this.animationSettings = settings;
  }

  updateSettings(settings: Partial<AnimationSettings>) {
    this.animationSettings = { ...this.animationSettings, ...settings };
  }

  // Trigger ripple effect
  triggerRipple(cellElement: HTMLElement): void {
    if (!this.animationSettings.enabled) return;

    // Clear any existing ripple
    cellElement.classList.remove('ripple-effect');
    
    // Force reflow
    cellElement.offsetHeight;
    
    // Add ripple effect
    cellElement.classList.add('ripple-effect');
    
    // Remove class after animation
    setTimeout(() => {
      cellElement.classList.remove('ripple-effect');
    }, this.animationSettings.duration.ripple);
  }

  // Trigger cell reveal animation
  triggerReveal(cellElement: HTMLElement, delay: number = 0): void {
    if (!this.animationSettings.enabled) return;

    const animate = () => {
      cellElement.classList.add('revealing');
      
      setTimeout(() => {
        cellElement.classList.remove('revealing');
      }, this.animationSettings.duration.reveal);
    };

    if (delay > 0) {
      setTimeout(animate, delay);
    } else {
      animate();
    }
  }

  // Trigger click animation
  triggerClick(cellElement: HTMLElement): void {
    if (!this.animationSettings.enabled) return;

    cellElement.classList.remove('clicking');
    cellElement.offsetHeight; // Force reflow
    cellElement.classList.add('clicking');
    
    setTimeout(() => {
      cellElement.classList.remove('clicking');
    }, this.animationSettings.duration.click);
  }

  // Trigger cascade reveal for multiple cells
  triggerCascadeReveal(cellElements: HTMLElement[], centerX: number, centerY: number): void {
    if (!this.animationSettings.enabled) return;

    const cellPositions = cellElements.map((element, index) => {
      const rect = element.getBoundingClientRect();
      const cellCenterX = rect.left + rect.width / 2;
      const cellCenterY = rect.top + rect.height / 2;
      const distance = Math.sqrt(
        Math.pow(cellCenterX - centerX, 2) + Math.pow(cellCenterY - centerY, 2)
      );
      return { element, distance, index };
    });

    // Sort by distance from center
    cellPositions.sort((a, b) => a.distance - b.distance);

    // Animate cells in waves based on distance
    cellPositions.forEach(({ element, distance }, index) => {
      const delay = Math.min(distance * 0.5, 800); // Max delay of 800ms
      
      setTimeout(() => {
        element.classList.add('cascade-reveal');
        this.triggerRipple(element);
        
        setTimeout(() => {
          element.classList.remove('cascade-reveal');
        }, this.animationSettings.duration.cascade);
      }, delay);
    });
  }

  // Enhanced hover effect with glow
  enhanceHover(cellElement: HTMLElement): void {
    if (!this.animationSettings.enabled) return;

    const handleMouseEnter = () => {
      if (cellElement.classList.contains('revealed') || cellElement.classList.contains('mine')) {
        return;
      }
      
      // Add hover glow effect using CSS custom properties
      cellElement.style.setProperty('--hover-glow', 'var(--theme-hoverGlow)');
      cellElement.style.boxShadow = `0 6px 12px var(--theme-cellShadowHover), 0 0 20px var(--theme-hoverGlow)`;
    };

    const handleMouseLeave = () => {
      cellElement.style.removeProperty('--hover-glow');
      cellElement.style.removeProperty('box-shadow');
    };

    cellElement.addEventListener('mouseenter', handleMouseEnter);
    cellElement.addEventListener('mouseleave', handleMouseLeave);

    // Store cleanup function
    (cellElement as any).cleanupHover = () => {
      cellElement.removeEventListener('mouseenter', handleMouseEnter);
      cellElement.removeEventListener('mouseleave', handleMouseLeave);
    };
  }

  // Cleanup all animations for a cell
  cleanup(cellElement: HTMLElement): void {
    // Remove all animation classes
    const animationClasses = ['ripple-effect', 'revealing', 'clicking', 'cascade-reveal'];
    animationClasses.forEach(className => {
      cellElement.classList.remove(className);
    });

    // Cleanup hover effects
    if ((cellElement as any).cleanupHover) {
      (cellElement as any).cleanupHover();
    }

    // Clear any pending timeouts
    const elementId = cellElement.dataset.cellId;
    if (elementId && this.animationTimeouts.has(elementId)) {
      clearTimeout(this.animationTimeouts.get(elementId)!);
      this.animationTimeouts.delete(elementId);
    }
  }

  // Cleanup all animations
  cleanupAll(): void {
    this.animationTimeouts.forEach(timeout => clearTimeout(timeout));
    this.animationTimeouts.clear();
  }
}

// Create a global instance
export const cellAnimationManager = new CellAnimationManager();

// Animation utilities
export const animationUtils = {
  // Disable animations for reduced motion users
  respectsReducedMotion(): boolean {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  },

  // Get optimal delay based on cell count for cascade animations
  getCascadeDelay(totalCells: number): number {
    if (totalCells < 10) return 20;
    if (totalCells < 50) return 15;
    if (totalCells < 100) return 10;
    return 5;
  },

  // Create staggered animation delays
  createStaggeredDelays(count: number, maxDelay: number = 500): number[] {
    return Array.from({ length: count }, (_, i) => (i * maxDelay) / count);
  },
};