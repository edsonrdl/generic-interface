import { Component, HostBinding, Input, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Subject, takeUntil, filter } from 'rxjs';
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
  changeDetection: ChangeDetectionStrategy.OnPush, // ⚡ OnPush para melhor performance
  animations: [
    trigger('children', [
      state('collapsed', style({ height: '0' })),
      state('expanded', style({ height: '*' })),
      transition('collapsed <=> expanded', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)'))
    ])
  ]
})
export class MenuItemComponent implements OnInit, OnDestroy {
  @Input() item!: MenuItem;
  @Input() index!: number;
  @Input() @HostBinding('class.layout-root-menuitem') root!: boolean;
  @Input() parentKey!: string;

  active = false;
  key: string = '';

  // ⚡ Usar Subject para unsubscribe automático
  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private layoutService: LayoutService,
    private cdr: ChangeDetectorRef // ⚡ Necessário com OnPush
  ) {}

  ngOnInit(): void {
    this.key = this.parentKey ? `${this.parentKey}-${this.index}` : String(this.index);

    // ⚡ Subscription otimizada com takeUntil
    this.layoutService.menuSource$
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        // ⚡ Removido Promise.resolve desnecessário
        if (value.routeEvent) {
          this.active = value.key === this.key || value.key.startsWith(`${this.key}-`);
        } else {
          if (value.key !== this.key && !value.key.startsWith(`${this.key}-`)) {
            this.active = false;
          }
        }
        this.cdr.markForCheck(); // ⚡ Marcar para check com OnPush
      });

    this.layoutService.resetSource$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.active = false;
        this.cdr.markForCheck();
      });

    // ⚡ Subscription do router otimizada
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        if (this.item?.routerLink) {
          this.updateActiveStateFromRoute();
        }
      });

    // Verificar estado inicial
    if (this.item?.routerLink) {
      this.updateActiveStateFromRoute();
    }
  }

  updateActiveStateFromRoute(): void {
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
      console.warn('Error checking route active state:', error);
    }
  }

  itemClick(event: Event): void {
    if (this.item?.disabled) {
      event.preventDefault();
      return;
    }

    if (this.item?.command) {
      this.item.command({ originalEvent: event, item: this.item });
    }

    if (this.item?.items) {
      this.active = !this.active;
      this.cdr.markForCheck();
    }

    this.layoutService.onMenuStateChange({ key: this.key });
  }

  get submenuAnimation(): string {
    return this.root ? 'expanded' : this.active ? 'expanded' : 'collapsed';
  }

  @HostBinding('class.active-menuitem')
  get activeClass(): boolean {
    return this.active && !this.root;
  }

  ngOnDestroy(): void {
    // ⚡ Unsubscribe automático com Subject
    this.destroy$.next();
    this.destroy$.complete();
  }
}