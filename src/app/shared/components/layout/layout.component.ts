import { Component, Renderer2, ViewChild, Inject, PLATFORM_ID, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { CommonModule, isPlatformBrowser, DOCUMENT } from '@angular/common';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { TopBarComponent } from '../top-bar/top-bar.component';
import { SideBarComponent } from '../side-bar/side-bar.component';
import { FooterComponent } from '../footer/footer.component';
import { LayoutService } from '../service/layout.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, TopBarComponent, SideBarComponent, RouterModule, FooterComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush // ⚡ OnPush para melhor performance
})
export class LayoutComponent implements OnDestroy {
  private overlayMenuOpenSubscription?: Subscription;
  private menuOutsideClickListener?: () => void;
  private routerSubscription?: Subscription;

  @ViewChild(SideBarComponent) appSidebar!: SideBarComponent;
  @ViewChild(TopBarComponent) appTopBar!: TopBarComponent;

  constructor(
    public layoutService: LayoutService,
    private renderer: Renderer2,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.initializeSubscriptions();
  }

  private initializeSubscriptions(): void {
    // Subscription do overlay menu
    this.overlayMenuOpenSubscription = this.layoutService.overlayOpen$.subscribe(() => {
      if (isPlatformBrowser(this.platformId)) {
        this.setupOutsideClickListener();

        if (this.layoutService.layoutState().staticMenuMobileActive) {
          this.blockBodyScroll();
        }
      }
    });

    // Subscription do router - usar takeUntilDestroyed seria melhor no Angular 16+
    this.routerSubscription = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.hideMenu();
      });
  }

  private setupOutsideClickListener(): void {
    if (!this.menuOutsideClickListener) {
      // Usar passive listener para melhor performance
      this.menuOutsideClickListener = this.renderer.listen('document', 'click', (event: MouseEvent) => {
        if (this.isOutsideClicked(event)) {
          this.hideMenu();
        }
      });
    }
  }

  isOutsideClicked(event: MouseEvent): boolean {
    if (!isPlatformBrowser(this.platformId)) {
      return false;
    }

    const sidebarEl = this.document.querySelector('.layout-sidebar');
    const topbarEl = this.document.querySelector('.layout-menu-button');
    const eventTarget = event.target as Node;

    return !(
      sidebarEl?.isSameNode(eventTarget) || 
      sidebarEl?.contains(eventTarget) || 
      topbarEl?.isSameNode(eventTarget) || 
      topbarEl?.contains(eventTarget)
    );
  }

  hideMenu(): void {
    this.layoutService.layoutState.update((prev) => ({ 
      ...prev, 
      overlayMenuActive: false, 
      staticMenuMobileActive: false, 
      menuHoverActive: false 
    }));
    
    this.cleanupOutsideClickListener();
    this.unblockBodyScroll();
  }

  private cleanupOutsideClickListener(): void {
    if (this.menuOutsideClickListener) {
      this.menuOutsideClickListener();
      this.menuOutsideClickListener = undefined;
    }
  }

  blockBodyScroll(): void {
    if (!isPlatformBrowser(this.platformId) || !this.document.body) {
      return;
    }

    this.document.body.classList.add('blocked-scroll');
  }

  unblockBodyScroll(): void {
    if (!isPlatformBrowser(this.platformId) || !this.document.body) {
      return;
    }

    this.document.body.classList.remove('blocked-scroll');
  }

  get containerClass() {
    const config = this.layoutService.layoutConfig();
    const state = this.layoutService.layoutState();
    
    return {
      'layout-overlay': config.menuMode === 'overlay',
      'layout-static': config.menuMode === 'static',
      'layout-static-inactive': state.staticMenuDesktopInactive && config.menuMode === 'static',
      'layout-overlay-active': state.overlayMenuActive,
      'layout-mobile-active': state.staticMenuMobileActive
    };
  }

  ngOnDestroy(): void {
    this.overlayMenuOpenSubscription?.unsubscribe();
    this.routerSubscription?.unsubscribe();
    this.cleanupOutsideClickListener();
    this.unblockBodyScroll();
  }
}