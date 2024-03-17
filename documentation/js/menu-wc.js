'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">product-reviews documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-bs-toggle="collapse" ${ isNormalMode ?
                                'data-bs-target="#modules-links"' : 'data-bs-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link" >AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-AppModule-b93b4144c210c43f8c54e9b480c32eb220d1dbc20dbd3731492e0fdd72e1736ab3b1f8fbe59880b8f3297ef50b6cb7b17105b39b79ef2c6b645ebe50dc4e3f06"' : 'data-bs-target="#xs-controllers-links-module-AppModule-b93b4144c210c43f8c54e9b480c32eb220d1dbc20dbd3731492e0fdd72e1736ab3b1f8fbe59880b8f3297ef50b6cb7b17105b39b79ef2c6b645ebe50dc4e3f06"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AppModule-b93b4144c210c43f8c54e9b480c32eb220d1dbc20dbd3731492e0fdd72e1736ab3b1f8fbe59880b8f3297ef50b6cb7b17105b39b79ef2c6b645ebe50dc4e3f06"' :
                                            'id="xs-controllers-links-module-AppModule-b93b4144c210c43f8c54e9b480c32eb220d1dbc20dbd3731492e0fdd72e1736ab3b1f8fbe59880b8f3297ef50b6cb7b17105b39b79ef2c6b645ebe50dc4e3f06"' }>
                                            <li class="link">
                                                <a href="controllers/AppController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-AppModule-b93b4144c210c43f8c54e9b480c32eb220d1dbc20dbd3731492e0fdd72e1736ab3b1f8fbe59880b8f3297ef50b6cb7b17105b39b79ef2c6b645ebe50dc4e3f06"' : 'data-bs-target="#xs-injectables-links-module-AppModule-b93b4144c210c43f8c54e9b480c32eb220d1dbc20dbd3731492e0fdd72e1736ab3b1f8fbe59880b8f3297ef50b6cb7b17105b39b79ef2c6b645ebe50dc4e3f06"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AppModule-b93b4144c210c43f8c54e9b480c32eb220d1dbc20dbd3731492e0fdd72e1736ab3b1f8fbe59880b8f3297ef50b6cb7b17105b39b79ef2c6b645ebe50dc4e3f06"' :
                                        'id="xs-injectables-links-module-AppModule-b93b4144c210c43f8c54e9b480c32eb220d1dbc20dbd3731492e0fdd72e1736ab3b1f8fbe59880b8f3297ef50b6cb7b17105b39b79ef2c6b645ebe50dc4e3f06"' }>
                                        <li class="link">
                                            <a href="injectables/AppService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/ProductsModule.html" data-type="entity-link" >ProductsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-ProductsModule-e30f63f3f7ce133b9706d99f36c16e18057aaa0bded1e4a2a95f79b491edd380f7412be1fc4f9242f9e6db13e5e8541b0c18f6c8150ff9478765ac7416d82d3c"' : 'data-bs-target="#xs-controllers-links-module-ProductsModule-e30f63f3f7ce133b9706d99f36c16e18057aaa0bded1e4a2a95f79b491edd380f7412be1fc4f9242f9e6db13e5e8541b0c18f6c8150ff9478765ac7416d82d3c"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-ProductsModule-e30f63f3f7ce133b9706d99f36c16e18057aaa0bded1e4a2a95f79b491edd380f7412be1fc4f9242f9e6db13e5e8541b0c18f6c8150ff9478765ac7416d82d3c"' :
                                            'id="xs-controllers-links-module-ProductsModule-e30f63f3f7ce133b9706d99f36c16e18057aaa0bded1e4a2a95f79b491edd380f7412be1fc4f9242f9e6db13e5e8541b0c18f6c8150ff9478765ac7416d82d3c"' }>
                                            <li class="link">
                                                <a href="controllers/ProductsController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ProductsController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-ProductsModule-e30f63f3f7ce133b9706d99f36c16e18057aaa0bded1e4a2a95f79b491edd380f7412be1fc4f9242f9e6db13e5e8541b0c18f6c8150ff9478765ac7416d82d3c"' : 'data-bs-target="#xs-injectables-links-module-ProductsModule-e30f63f3f7ce133b9706d99f36c16e18057aaa0bded1e4a2a95f79b491edd380f7412be1fc4f9242f9e6db13e5e8541b0c18f6c8150ff9478765ac7416d82d3c"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ProductsModule-e30f63f3f7ce133b9706d99f36c16e18057aaa0bded1e4a2a95f79b491edd380f7412be1fc4f9242f9e6db13e5e8541b0c18f6c8150ff9478765ac7416d82d3c"' :
                                        'id="xs-injectables-links-module-ProductsModule-e30f63f3f7ce133b9706d99f36c16e18057aaa0bded1e4a2a95f79b491edd380f7412be1fc4f9242f9e6db13e5e8541b0c18f6c8150ff9478765ac7416d82d3c"' }>
                                        <li class="link">
                                            <a href="injectables/ProductsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ProductsService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/ReviewProcessorModule.html" data-type="entity-link" >ReviewProcessorModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-ReviewProcessorModule-e0e341c842cfa6c25a4c5bda254d45ce98bca07e8c3ed1e82c8a85a4e462f78ac618a284d79d0db62f49410aeca765e958fad4a149f487050213fa71f6b11d2a"' : 'data-bs-target="#xs-controllers-links-module-ReviewProcessorModule-e0e341c842cfa6c25a4c5bda254d45ce98bca07e8c3ed1e82c8a85a4e462f78ac618a284d79d0db62f49410aeca765e958fad4a149f487050213fa71f6b11d2a"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-ReviewProcessorModule-e0e341c842cfa6c25a4c5bda254d45ce98bca07e8c3ed1e82c8a85a4e462f78ac618a284d79d0db62f49410aeca765e958fad4a149f487050213fa71f6b11d2a"' :
                                            'id="xs-controllers-links-module-ReviewProcessorModule-e0e341c842cfa6c25a4c5bda254d45ce98bca07e8c3ed1e82c8a85a4e462f78ac618a284d79d0db62f49410aeca765e958fad4a149f487050213fa71f6b11d2a"' }>
                                            <li class="link">
                                                <a href="controllers/ReviewProcessorController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ReviewProcessorController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-ReviewProcessorModule-e0e341c842cfa6c25a4c5bda254d45ce98bca07e8c3ed1e82c8a85a4e462f78ac618a284d79d0db62f49410aeca765e958fad4a149f487050213fa71f6b11d2a"' : 'data-bs-target="#xs-injectables-links-module-ReviewProcessorModule-e0e341c842cfa6c25a4c5bda254d45ce98bca07e8c3ed1e82c8a85a4e462f78ac618a284d79d0db62f49410aeca765e958fad4a149f487050213fa71f6b11d2a"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ReviewProcessorModule-e0e341c842cfa6c25a4c5bda254d45ce98bca07e8c3ed1e82c8a85a4e462f78ac618a284d79d0db62f49410aeca765e958fad4a149f487050213fa71f6b11d2a"' :
                                        'id="xs-injectables-links-module-ReviewProcessorModule-e0e341c842cfa6c25a4c5bda254d45ce98bca07e8c3ed1e82c8a85a4e462f78ac618a284d79d0db62f49410aeca765e958fad4a149f487050213fa71f6b11d2a"' }>
                                        <li class="link">
                                            <a href="injectables/ReviewProcessorService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ReviewProcessorService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/ReviewsModule.html" data-type="entity-link" >ReviewsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-ReviewsModule-99ff4cce61f193ec5003fd4c32418413d402679353d17ec9df84ee1337516d7edca78b2479fc7b4e99a008d36ccc966e5024d4306220bce1165ada1b3bbea3c4"' : 'data-bs-target="#xs-controllers-links-module-ReviewsModule-99ff4cce61f193ec5003fd4c32418413d402679353d17ec9df84ee1337516d7edca78b2479fc7b4e99a008d36ccc966e5024d4306220bce1165ada1b3bbea3c4"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-ReviewsModule-99ff4cce61f193ec5003fd4c32418413d402679353d17ec9df84ee1337516d7edca78b2479fc7b4e99a008d36ccc966e5024d4306220bce1165ada1b3bbea3c4"' :
                                            'id="xs-controllers-links-module-ReviewsModule-99ff4cce61f193ec5003fd4c32418413d402679353d17ec9df84ee1337516d7edca78b2479fc7b4e99a008d36ccc966e5024d4306220bce1165ada1b3bbea3c4"' }>
                                            <li class="link">
                                                <a href="controllers/ReviewsController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ReviewsController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-ReviewsModule-99ff4cce61f193ec5003fd4c32418413d402679353d17ec9df84ee1337516d7edca78b2479fc7b4e99a008d36ccc966e5024d4306220bce1165ada1b3bbea3c4"' : 'data-bs-target="#xs-injectables-links-module-ReviewsModule-99ff4cce61f193ec5003fd4c32418413d402679353d17ec9df84ee1337516d7edca78b2479fc7b4e99a008d36ccc966e5024d4306220bce1165ada1b3bbea3c4"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ReviewsModule-99ff4cce61f193ec5003fd4c32418413d402679353d17ec9df84ee1337516d7edca78b2479fc7b4e99a008d36ccc966e5024d4306220bce1165ada1b3bbea3c4"' :
                                        'id="xs-injectables-links-module-ReviewsModule-99ff4cce61f193ec5003fd4c32418413d402679353d17ec9df84ee1337516d7edca78b2479fc7b4e99a008d36ccc966e5024d4306220bce1165ada1b3bbea3c4"' }>
                                        <li class="link">
                                            <a href="injectables/ReviewsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ReviewsService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                </ul>
                </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#entities-links"' :
                                'data-bs-target="#xs-entities-links"' }>
                                <span class="icon ion-ios-apps"></span>
                                <span>Entities</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="entities-links"' : 'id="xs-entities-links"' }>
                                <li class="link">
                                    <a href="entities/Product.html" data-type="entity-link" >Product</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Product-1.html" data-type="entity-link" >Product</a>
                                </li>
                                <li class="link">
                                    <a href="entities/ProductRating.html" data-type="entity-link" >ProductRating</a>
                                </li>
                                <li class="link">
                                    <a href="entities/ProductRating-1.html" data-type="entity-link" >ProductRating</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Review.html" data-type="entity-link" >Review</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Review-1.html" data-type="entity-link" >Review</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#classes-links"' :
                            'data-bs-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/CreateProductDto.html" data-type="entity-link" >CreateProductDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateReviewDto.html" data-type="entity-link" >CreateReviewDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetProductDto.html" data-type="entity-link" >GetProductDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetReviewDto.html" data-type="entity-link" >GetReviewDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/ProductNotFoundError.html" data-type="entity-link" >ProductNotFoundError</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateProductDto.html" data-type="entity-link" >UpdateProductDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateReviewDto.html" data-type="entity-link" >UpdateReviewDto</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#injectables-links"' :
                                'data-bs-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/LoggingInterceptor.html" data-type="entity-link" >LoggingInterceptor</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#miscellaneous-links"'
                            : 'data-bs-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank" rel="noopener noreferrer">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});