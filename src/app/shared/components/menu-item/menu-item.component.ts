import { Component, HostBinding, Input, OnInit, OnDestroy } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { RippleModule } from 'primeng/ripple';
import { MenuItem } from 'primeng/api';
import { LayoutService } from '../service/layout.service';

@Component({
  selector: '[app-menu-item]',
  standalone: true,
  imports: [CommonModule, RouterModule, RippleModule],
  templateUrl: './menu-item.component.html',
  styleUrl: './menu-item.component.scss',
  animations: [
    trigger('children', [
      state(
        'collapsed',
        style({
          height: '0'
        })
      ),
      state(
        'expanded',
        style({
          height: '*'
        })
      ),
      transition('collapsed <=> expanded', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)'))
    ])
  ]
  // REMOVED: providers: [LayoutService] - This was creating new instances
})
export class MenuItemComponent implements OnInit, OnDestroy {

  @Input() item!: MenuItem;
  @Input() index!: number;
  @Input() @HostBinding('class.layout-root-menuitem') root!: boolean;
  @Input() parentKey!: string;

  active = false;
  menuSourceSubscription!: Subscription;
  menuResetSubscription!: Subscription;
  routerSubscription!: Subscription;
  key: string = '';

  constructor(
    public router: Router,
    private layoutService: LayoutService // This will now use the singleton instance
  ) {}

  ngOnInit() {
    this.key = this.parentKey ? this.parentKey + '-' + this.index : String(this.index);

    // Initialize subscriptions in ngOnInit instead of constructor
    this.menuSourceSubscription = this.layoutService.menuSource$.subscribe((value) => {
      Promise.resolve(null).then(() => {
        if (value.routeEvent) {
          this.active = value.key === this.key || value.key.startsWith(this.key + '-') ? true : false;
        } else {
          if (value.key !== this.key && !value.key.startsWith(this.key + '-')) {
            this.active = false;
          }
        }
      });
    });

    this.menuResetSubscription = this.layoutService.resetSource$.subscribe(() => {
      this.active = false;
    });

    this.routerSubscription = this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd)
    ).subscribe(() => {
      if (this.item?.routerLink) {
        this.updateActiveStateFromRoute();
      }
    });

    // Check initial route state
    if (this.item?.routerLink) {
      this.updateActiveStateFromRoute();
    }
  }

  updateActiveStateFromRoute() {
    if (!this.item?.routerLink || !Array.isArray(this.item.routerLink) || this.item.routerLink.length === 0) {
      return;
    }

    try {
      const activeRoute = this.router.isActive(this.item.routerLink[0], { 
        paths: 'exact', 
        queryParams: 'ignored', 
        matrixParams: 'ignored', 
        fragment: 'ignored' 
      });

      if (activeRoute) {
        this.layoutService.onMenuStateChange({ key: this.key, routeEvent: true });
      }
    } catch (error) {
      // Handle potential router errors gracefully
      console.warn('Error checking route active state:', error);
    }
  }

  itemClick(event: Event) {
    // Avoid processing disabled items
    if (this.item?.disabled) {
      event.preventDefault();
      return;
    }

    // Execute command
    if (this.item?.command) {
      this.item.command({ originalEvent: event, item: this.item });
    }

    // Toggle active state
    if (this.item?.items) {
      this.active = !this.active;
    }

    this.layoutService.onMenuStateChange({ key: this.key });
  }

  get submenuAnimation() {
    return this.root ? 'expanded' : this.active ? 'expanded' : 'collapsed';
  }

  @HostBinding('class.active-menuitem')
  get activeClass() {
    return this.active && !this.root;
  }

  ngOnDestroy() {
    // Clean up all subscriptions
    if (this.menuSourceSubscription) {
      this.menuSourceSubscription.unsubscribe();
    }

    if (this.menuResetSubscription) {
      this.menuResetSubscription.unsubscribe();
    }

    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }
}