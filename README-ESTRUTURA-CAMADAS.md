# Generic Interface
```bash
my-ecommerce-app/
├── src/
├── styles/
│   ├── abstracts/
│   │   ├── _variables.scss
│   │   ├── _mixins.scss
│   │   └── _breakpoints.scss
│   ├── base/
│   │   ├── _reset.scss
│   │   └── _typography.scss
│   ├── themes/
│   │   ├── _dark.scss
│   │   └── _light.scss
│   ├── utilities/
│   │    ├── _animations.scss
│   │   └── _utils.scss
│   │ 
│   ├── app/
│   │   ├── core/
│   │   │   ├── services/
│   │   │   │   ├── api.service.ts
│   │   │   │   └── auth.service.ts
│   │   │   ├── interceptors/
│   │   │   │   ├── auth.interceptor.ts
│   │   │   │   └── error.interceptor.ts
│   │   │   ├── guards/
│   │   │   │   └── auth.guard.ts
│   │   │   └── models/
│   │   │       ├── api-response.interface.ts
│   │   │       └── pagination.interface.ts
│   │   │
│   │   ├── shared/
│   │   │   ├── components/
│   │   │   │   ├── loading/
│   │   │   │   │   ├── loading.component.html
│   │   │   │   │   ├── loading.component.css
│   │   │   │   │   └── loading.component.ts
│   │   │   │   ├── modal/
│   │   │   │   │   ├── modal.component.html
│   │   │   │   │   ├── modal.component.css
│   │   │   │   │   └── modal.component.ts
│   │   │   │   ├── confirmation-dialog/
│   │   │   │   │   ├── confirmation-dialog.component.html
│   │   │   │   │   ├── confirmation-dialog.component.css
│   │   │   │   │   └── confirmation-dialog.component.ts
│   │   │   │   └── pagination/
│   │   │   │       ├── pagination.component.html
│   │   │   │       ├── pagination.component.css
│   │   │   │       └── pagination.component.ts
│   │   │   ├── pipes/
│   │   │   │   └── currency.pipe.ts
│   │   │   └── validators/
│   │   │       └── custom-validators.ts
│   │   │
│   │   ├── features/
│   │   │   ├── products/
│   │   │   │   ├── pages/
│   │   │   │   │   ├── product-list/
│   │   │   │   │   │   ├── product-list.component.html
│   │   │   │   │   │   ├── product-list.component.css
│   │   │   │   │   │   └── product-list.component.ts
│   │   │   │   │   ├── product-create/
│   │   │   │   │   │   ├── product-create.component.html
│   │   │   │   │   │   ├── product-create.component.css
│   │   │   │   │   │   └── product-create.component.ts
│   │   │   │   │   ├── product-edit/
│   │   │   │   │   │   ├── product-edit.component.html
│   │   │   │   │   │   ├── product-edit.component.css
│   │   │   │   │   │   └── product-edit.component.ts
│   │   │   │   │   └── product-detail/
│   │   │   │   │       ├── product-detail.component.html
│   │   │   │   │       ├── product-detail.component.css
│   │   │   │   │       └── product-detail.component.ts
│   │   │   │   ├── components/
│   │   │   │   │   ├── product-form/
│   │   │   │   │   │   ├── product-form.component.html
│   │   │   │   │   │   ├── product-form.component.css
│   │   │   │   │   │   └── product-form.component.ts
│   │   │   │   │   └── product-card/
│   │   │   │   │       ├── product-card.component.html
│   │   │   │   │       ├── product-card.component.css
│   │   │   │   │       └── product-card.component.ts
│   │   │   │   ├── services/
│   │   │   │   │   └── product.service.ts
│   │   │   │   ├── models/
│   │   │   │   │   └── product.interface.ts
│   │   │   │   └── resolvers/
│   │   │   │       └── product.resolver.ts
│   │   │   │
│   │   │   ├── usuarios/
│   │   │   │   ├── pages/
│   │   │   │   │   ├── usuario-list/
│   │   │   │   │   ├── usuario-create/
│   │   │   │   │   ├── usuario-edit/
│   │   │   │   │   └── usuario-detail/
│   │   │   │   ├── components/
│   │   │   │   │   ├── usuario-form/
│   │   │   │   │   └── usuario-card/
│   │   │   │   ├── services/
│   │   │   │   │   └── usuario.service.ts
│   │   │   │   ├── models/
│   │   │   │   │   └── usuario.interface.ts
│   │   │   │   └── resolvers/
│   │   │   │       └── usuario.resolver.ts
│   │   │   │
│   │   │   └── dashboard/
│   │   │       ├── dashboard.component.html
│   │   │       ├── dashboard.component.css
│   │   │       └── dashboard.component.ts
│   │   │
│   │   ├── layout/
│   │   │   ├── header/
│   │   │   │   ├── header.component.html
│   │   │   │   ├── header.component.css
│   │   │   │   └── header.component.ts
│   │   │   ├── sidebar/
│   │   │   │   ├── sidebar.component.html
│   │   │   │   ├── sidebar.component.css
│   │   │   │   └── sidebar.component.ts
│   │   │   └── main-layout/
│   │   │       ├── main-layout.component.html
│   │   │       ├── main-layout.component.css
│   │   │       └── main-layout.component.ts
│   │   │
│   │   ├── app.routes.ts
│   │   ├── app.config.ts
│   │   ├── app.component.html
│   │   ├── app.component.css
│   │   └── app.component.ts
│   │
│   ├── environments/
│   │   ├── environment.ts
│   │   └── environment.prod.ts
│   │
│   ├── main.ts
│   └── index.html
```
