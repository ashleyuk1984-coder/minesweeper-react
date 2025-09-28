// Particle Effects System for Minesweeper
export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  gravity: number;
  rotation: number;
  rotationSpeed: number;
  alpha: number;
  type: 'explosion' | 'confetti' | 'dust' | 'spark';
}

export class ParticleSystem {
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private particles: Particle[] = [];
  private animationId: number | null = null;
  private isRunning = false;
  private enabled = true;

  constructor() {
    this.createCanvas();
  }

  private createCanvas() {
    // Create a canvas overlay for particles
    this.canvas = document.createElement('canvas');
    this.canvas.style.position = 'fixed';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.pointerEvents = 'none';
    this.canvas.style.zIndex = '9999';
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    
    document.body.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');

    // Handle window resize
    window.addEventListener('resize', () => {
      if (this.canvas) {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
      }
    });
  }

  private createExplosionParticle(x: number, y: number): Particle {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 8 + 2;
    const colors = ['#ff4444', '#ff6666', '#ff8888', '#ffaa44', '#ff6600'];
    
    return {
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 0,
      maxLife: Math.random() * 60 + 30,
      size: Math.random() * 6 + 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      gravity: 0.1,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.2,
      alpha: 1,
      type: 'explosion'
    };
  }

  private createConfettiParticle(x: number, y: number): Particle {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 6 + 3;
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#6c5ce7', '#a55eea'];
    
    return {
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - Math.random() * 5,
      life: 0,
      maxLife: Math.random() * 120 + 60,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      gravity: 0.1,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.3,
      alpha: 1,
      type: 'confetti'
    };
  }

  private createDustParticle(x: number, y: number): Particle {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 2 + 0.5;
    const grays = ['#cccccc', '#dddddd', '#eeeeee', '#f5f5f5'];
    
    return {
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 0,
      maxLife: Math.random() * 30 + 20,
      size: Math.random() * 3 + 1,
      color: grays[Math.floor(Math.random() * grays.length)],
      gravity: -0.02, // Dust floats up slightly
      rotation: 0,
      rotationSpeed: 0,
      alpha: 0.6,
      type: 'dust'
    };
  }

  private createSparkParticle(x: number, y: number): Particle {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 10 + 5;
    
    return {
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 0,
      maxLife: Math.random() * 20 + 10,
      size: Math.random() * 2 + 1,
      color: '#ffffff',
      gravity: 0.2,
      rotation: 0,
      rotationSpeed: 0,
      alpha: 1,
      type: 'spark'
    };
  }

  private updateParticle(particle: Particle) {
    particle.life++;
    particle.x += particle.vx;
    particle.y += particle.vy;
    particle.vy += particle.gravity;
    particle.rotation += particle.rotationSpeed;
    
    // Fade out over time
    const lifeRatio = particle.life / particle.maxLife;
    particle.alpha = 1 - lifeRatio;
    
    // Add some air resistance
    particle.vx *= 0.99;
    particle.vy *= 0.99;
  }

  private drawParticle(particle: Particle) {
    if (!this.ctx) return;
    
    this.ctx.save();
    this.ctx.globalAlpha = particle.alpha;
    this.ctx.translate(particle.x, particle.y);
    this.ctx.rotate(particle.rotation);
    
    if (particle.type === 'confetti') {
      // Draw rectangles for confetti
      this.ctx.fillStyle = particle.color;
      this.ctx.fillRect(-particle.size / 2, -particle.size / 4, particle.size, particle.size / 2);
    } else if (particle.type === 'spark') {
      // Draw bright lines for sparks
      this.ctx.strokeStyle = particle.color;
      this.ctx.lineWidth = particle.size;
      this.ctx.beginPath();
      this.ctx.moveTo(-particle.size, 0);
      this.ctx.lineTo(particle.size, 0);
      this.ctx.stroke();
    } else {
      // Draw circles for explosion and dust
      this.ctx.fillStyle = particle.color;
      this.ctx.beginPath();
      this.ctx.arc(0, 0, particle.size, 0, Math.PI * 2);
      this.ctx.fill();
    }
    
    this.ctx.restore();
  }

  private animate = () => {
    if (!this.ctx || !this.canvas) return;
    
    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Update and draw particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const particle = this.particles[i];
      
      this.updateParticle(particle);
      this.drawParticle(particle);
      
      // Remove dead particles
      if (particle.life >= particle.maxLife || particle.alpha <= 0) {
        this.particles.splice(i, 1);
      }
    }
    
    // Continue animation if particles exist
    if (this.particles.length > 0) {
      this.animationId = requestAnimationFrame(this.animate);
    } else {
      this.isRunning = false;
    }
  };

  private startAnimation() {
    if (!this.isRunning) {
      this.isRunning = true;
      this.animate();
    }
  }

  // Control methods
  setEnabled(enabled: boolean) {
    this.enabled = enabled;
    if (!enabled) {
      this.clear();
    }
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  // Public methods for creating effects
  explosion(x: number, y: number, intensity = 1) {
    if (!this.enabled) return;
    
    const particleCount = Math.floor(intensity * 20 + 10);
    
    for (let i = 0; i < particleCount; i++) {
      this.particles.push(this.createExplosionParticle(x, y));
    }
    
    // Add some sparks for extra effect
    for (let i = 0; i < particleCount / 2; i++) {
      this.particles.push(this.createSparkParticle(x, y));
    }
    
    this.startAnimation();
  }

  confetti(x: number, y: number, intensity = 1) {
    if (!this.enabled) return;
    
    const particleCount = Math.floor(intensity * 30 + 15);
    
    for (let i = 0; i < particleCount; i++) {
      this.particles.push(this.createConfettiParticle(x, y));
    }
    
    this.startAnimation();
  }

  dust(x: number, y: number, intensity = 1) {
    if (!this.enabled) return;
    
    const particleCount = Math.floor(intensity * 5 + 3);
    
    for (let i = 0; i < particleCount; i++) {
      this.particles.push(this.createDustParticle(x, y));
    }
    
    this.startAnimation();
  }

  // Get screen coordinates from element
  getElementCenter(element: HTMLElement): { x: number, y: number } {
    const rect = element.getBoundingClientRect();
    return {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    };
  }

  // Burst effect for multiple reveals
  multiRevealBurst(centers: Array<{ x: number, y: number }>) {
    centers.forEach(center => {
      this.dust(center.x, center.y, 0.5);
    });
  }

  // Victory celebration effect
  victoryBurst(x: number, y: number) {
    // Multiple waves of confetti
    this.confetti(x, y, 2);
    
    setTimeout(() => this.confetti(x - 50, y - 30, 1.5), 200);
    setTimeout(() => this.confetti(x + 50, y - 30, 1.5), 400);
    setTimeout(() => this.confetti(x, y - 60, 1), 600);
  }

  // Clear all particles
  clear() {
    this.particles = [];
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    this.isRunning = false;
    
    if (this.ctx && this.canvas) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }

  // Cleanup
  destroy() {
    this.clear();
    if (this.canvas && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }
  }
}

// Singleton instance
export const particleSystem = new ParticleSystem();