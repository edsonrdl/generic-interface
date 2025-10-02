import { Component, Renderer2, ViewChild, Inject, PLATFORM_ID} from '@angular/core';
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
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {
  overlayMenuOpenSubscription: Subscription;
  menuOutsideClickListener: any;

  @ViewChild(SideBarComponent) appSidebar!: SideBarComponent;
  @ViewChild(TopBarComponent) appTopBar!: TopBarComponent;

  constructor(
    public layoutService: LayoutService,
    public renderer: Renderer2,
    public router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.overlayMenuOpenSubscription = this.layoutService.overlayOpen$.subscribe(() => {
      if (isPlatformBrowser(this.platformId)) {
        if (!this.menuOutsideClickListener) {
          this.menuOutsideClickListener = this.renderer.listen('document', 'click', (event) => {
            if (this.isOutsideClicked(event)) {
              this.hideMenu();
            }
          });
        }

        if (this.layoutService.layoutState().staticMenuMobileActive) {
          this.blockBodyScroll();
        }
      }
    });

    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      this.hideMenu();
    });
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

  hideMenu() {
    this.layoutService.layoutState.update((prev) => ({ 
      ...prev, 
      overlayMenuActive: false, 
      staticMenuMobileActive: false, 
      menuHoverActive: false 
    }));
    
    if (this.menuOutsideClickListener) {
      this.menuOutsideClickListener();
      this.menuOutsideClickListener = null;
    }
    
    this.unblockBodyScroll();
  }

  blockBodyScroll(): void {
    if (!isPlatformBrowser(this.platformId) || !this.document.body) {
      return;
    }

    if (this.document.body.classList) {
      this.document.body.classList.add('blocked-scroll');
    } else {
      this.document.body.className += ' blocked-scroll';
    }
  }

  unblockBodyScroll(): void {
    if (!isPlatformBrowser(this.platformId) || !this.document.body) {
      return;
    }

    if (this.document.body.classList) {
      this.document.body.classList.remove('blocked-scroll');
    } else {
      this.document.body.className = this.document.body.className.replace(
        new RegExp('(^|\\b)' + 'blocked-scroll'.split(' ').join('|') + '(\\b|$)', 'gi'), 
        ' '
      );
    }
  }

  get containerClass() {
    return {
      'layout-overlay': this.layoutService.layoutConfig().menuMode === 'overlay',
      'layout-static': this.layoutService.layoutConfig().menuMode === 'static',
      'layout-static-inactive': this.layoutService.layoutState().staticMenuDesktopInactive && this.layoutService.layoutConfig().menuMode === 'static',
      'layout-overlay-active': this.layoutService.layoutState().overlayMenuActive,
      'layout-mobile-active': this.layoutService.layoutState().staticMenuMobileActive
    };
  }

  ngOnDestroy() {
    if (this.overlayMenuOpenSubscription) {
      this.overlayMenuOpenSubscription.unsubscribe();
    }

    if (this.menuOutsideClickListener) {
      this.menuOutsideClickListener();
    }
  }
}