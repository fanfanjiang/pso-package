import {
    on, off, closest, toggleClass, css, matrix, getWindowScrollingElement, getRect, isScrolledPast,
    getChild, lastChild, index, getRelativeScrollOffset, scrollBy, clone
} from './utils.js';
import { Safari, IOS, IE11OrLess, Edge } from './BrowserInfo.js';
import AnimationStateManager from './Animation.js';

let PositionGhostAbsolutely = IOS;
let ghostRelativeParent;
let ghostRelativeParentInitialScroll = [];
let awaitingDragStarted = false;
let lastDx;
let lastDy;
let tapDistanceLeft;
let tapDistanceTop;
let cloneHidden;
let moved;
let parentEl;
let _silent = false;
let pastFirstInvertThresh = false;
let isCircumstantialInvert = false;
let targetMoveDistance;
let lastTarget;
let lastDirection;
let lastDownEl;

class DragAndDrop {
    static init(options = {}) {
        this.options = options = Object.assign({}, options);

        let defaults = {
            dragableClass: 'dragable',
            dropableClass: 'dropable',
            ghostClass: 'ghost',
            removeCloneOnHide: true,
            easing: null,
            animation: 200,
            swapThreshold: 1,
            invertSwap: true,
            invertedSwapThreshold: 1,
            supportPointer: !!('PointerEvent' in window),
        }

        for (let name in defaults) {
            !(name in options) && (options[name] = defaults[name]);
        }

        for (let fn of Object.getOwnPropertyNames(this)) {
            if (fn.charAt(0) === '_' && typeof this[fn] === 'function') {
                this[fn] = this[fn].bind(this);
            }
        }
        if (options.supportPointer) {
            on(document.documentElement, 'pointerdown', this._onTapStart);
        } else {
            on(document.documentElement, 'mousedown', this._onTapStart);
            on(document.documentElement, 'touchstart', this._onTapStart);
        }

        Object.assign(this, AnimationStateManager());
        return this;
    }

    static _onTapStart(evt) {
        let options = this.options;
        let touch = (evt.touches && evt.touches[0]) || (evt.pointerType && evt.pointerType === 'touch' && evt);
        let target = (touch || evt).target;

        if (!evt.cancelable) return;

        if (this.dragEl) {
            return;
        }

        if (/mousedown|pointerdown/.test(evt.type) && evt.button !== 0) {
            return;
        }

        target = closest(target, `.${options.dragableClass}`);
        let container = closest(target, `.${options.dropableClass}`);

        if (!target || !container) {
            return;
        }

        if (target && target.animated) {
            return;
        }

        if (lastDownEl === target) {
            return;
        }

        let dragRect = getRect(target);
        this.dragEl = target;
        this.nextEl = this.dragEl.nextSibling;
        this.oldIndex = index(target);
        this.oldDraggableIndex = index(target, `.${options.dragableClass}`);

        let tapEvt = {
            target: this.dragEl,
            clientX: (touch || evt).clientX,
            clientY: (touch || evt).clientY
        };

        this.dragEl.style['will-change'] = 'all';

        this.tapEvt = tapEvt;

        this.birthContainer = container;

        tapDistanceLeft = tapEvt.clientX - dragRect.left;
        tapDistanceTop = tapEvt.clientY - dragRect.top;
        lastDownEl = target;

        on(document, 'mouseup', this._onDrop);
        on(document, 'touchend', this._onDrop);
        on(document, 'touchcancel', this._onDrop);

        this._triggerDragStart(evt, touch);
    }

    static _triggerDragStart(evt, touch) {
        touch = touch || (evt.pointerType == 'touch' && evt);

        if (this.options.supportPointer) {
            on(document, 'pointermove', this._onTouchMove);
        } else if (touch) {
            on(document, 'touchmove', this._onTouchMove);
        } else {
            on(document, 'mousemove', this._onTouchMove);
        }

        try {
            if (document.selection) {
                _nextTick(function () {
                    document.selection.empty();
                });
            } else {
                window.getSelection().removeAllRanges();
            }
        } catch (err) {
        }
    }

    static _onTouchMove(evt) {
        if (this.tapEvt) {
            let touch = evt.touches ? evt.touches[0] : evt;
            let ghostEl = this.ghostEl;
            let ghostMatrix = ghostEl && matrix(ghostEl);
            let scaleX = ghostEl && ghostMatrix && ghostMatrix.a;
            let scaleY = ghostEl && ghostMatrix && ghostMatrix.d;
            let relativeScrollOffset = PositionGhostAbsolutely && ghostRelativeParent && getRelativeScrollOffset(ghostRelativeParent);
            let dx = (touch.clientX - this.tapEvt.clientX)
                / (scaleX || 1)
                + (relativeScrollOffset ? (relativeScrollOffset[0] - ghostRelativeParentInitialScroll[0]) : 0) / (scaleX || 1);
            let dy = (touch.clientY - this.tapEvt.clientY)
                / (scaleY || 1)
                + (relativeScrollOffset ? (relativeScrollOffset[1] - ghostRelativeParentInitialScroll[1]) : 0) / (scaleY || 1);

            if (!ghostEl && !awaitingDragStarted) {
                this._onDragStart(evt, true);
            }

            if (ghostEl) {
                if (ghostMatrix) {
                    ghostMatrix.e += dx - (lastDx || 0);
                    ghostMatrix.f += dy - (lastDy || 0);
                } else {
                    ghostMatrix = {
                        a: 1,
                        b: 0,
                        c: 0,
                        d: 1,
                        e: dx,
                        f: dy
                    };
                }

                let cssMatrix = `matrix(${ghostMatrix.a},${ghostMatrix.b},${ghostMatrix.c},${ghostMatrix.d},${ghostMatrix.e},${ghostMatrix.f})`;

                css(ghostEl, 'webkitTransform', cssMatrix);
                css(ghostEl, 'mozTransform', cssMatrix);
                css(ghostEl, 'msTransform', cssMatrix);
                css(ghostEl, 'transform', cssMatrix);

                lastDx = dx;
                lastDy = dy;

                this.touchEvt = touch;
            }

            evt.cancelable && evt.preventDefault();
        }
    }

    static _onDragStart(evt) {
        this.cloneEl = clone(this.dragEl);

        this.cloneEl.draggable = false;
        this.cloneEl.style['will-change'] = '';

        this._hideClone();

        this._loopId = setInterval(this._emulateDragOver, 50);

        awaitingDragStarted = true;

        this._dragStartId = _nextTick(this._dragStarted.bind(this, evt));
        on(document, 'selectstart', this);

        moved = true;

        if (Safari) {
            css(document.body, 'user-select', 'none');
        }
    }

    static _dragStarted() {
        awaitingDragStarted = false;
        let options = this.options;

        toggleClass(this.dragEl, options.ghostClass, false);

        this._appendGhost();
    }

    static _appendGhost() {
        let ghostEl = this.ghostEl;
        if (!ghostEl) {
            let container = document.body,
                rect = getRect(this.dragEl, true, PositionGhostAbsolutely, true, container);

            if (PositionGhostAbsolutely) {
                ghostRelativeParent = container;

                while (
                    css(ghostRelativeParent, 'position') === 'static' &&
                    css(ghostRelativeParent, 'transform') === 'none' &&
                    ghostRelativeParent !== document
                ) {
                    ghostRelativeParent = ghostRelativeParent.parentNode;
                }

                if (ghostRelativeParent !== document.body && ghostRelativeParent !== document.documentElement) {
                    if (ghostRelativeParent === document) ghostRelativeParent = getWindowScrollingElement();

                    rect.top += ghostRelativeParent.scrollTop;
                    rect.left += ghostRelativeParent.scrollLeft;
                } else {
                    ghostRelativeParent = getWindowScrollingElement();
                }
                ghostRelativeParentInitialScroll = getRelativeScrollOffset(ghostRelativeParent);
            }


            ghostEl = this.dragEl.cloneNode(true);

            toggleClass(ghostEl, this.options.ghostClass, true);

            css(ghostEl, 'transition', '');
            css(ghostEl, 'transform', '');

            css(ghostEl, 'box-sizing', 'border-box');
            css(ghostEl, 'margin', 0);
            css(ghostEl, 'top', rect.top);
            css(ghostEl, 'left', rect.left);
            css(ghostEl, 'width', rect.width);
            css(ghostEl, 'height', rect.height);
            css(ghostEl, 'opacity', '0.4');
            css(ghostEl, 'position', (PositionGhostAbsolutely ? 'absolute' : 'fixed'));
            css(ghostEl, 'zIndex', '100000');
            css(ghostEl, 'pointerEvents', 'none');

            this.ghostEl = ghostEl;

            container.appendChild(ghostEl);

            css(ghostEl, 'transform-origin', (tapDistanceLeft / parseInt(ghostEl.style.width) * 100) + '% ' + (tapDistanceTop / parseInt(ghostEl.style.height) * 100) + '%');
        }
    }

    static _hideGhostForTarget() {
        this.ghostEl && css(this.ghostEl, 'display', 'none');
    }

    static _unhideGhostForTarget() {
        this.ghostEl && css(this.ghostEl, 'display', '');
    }

    static _emulateDragOver() {
        let touchEvt = this.touchEvt;
        let options = this.options;

        if (touchEvt) {
            this._lastX = touchEvt.clientX;
            this._lastY = touchEvt.clientY;

            this._hideGhostForTarget();

            let target = document.elementFromPoint(touchEvt.clientX, touchEvt.clientY);
            let dropContainer = closest(target, `.${options.dropableClass}`);


            if (dropContainer) {

                this._isOutsideThisEl(dropContainer, target);

                let inserted = this._onDragOver({
                    clientX: touchEvt.clientX,
                    clientY: touchEvt.clientY,
                    target: target,
                    parent: dropContainer
                });
            }

            this._unhideGhostForTarget();
        }
    }

    static _onDragOver(evt) {
        let target = evt.target;
        let birthContainer = this.birthContainer;
        let dropContainer = evt.parent;
        let fromContainer = this.putContainer || birthContainer;
        let options = this.options;
        let dragEl = this.dragEl;
        let isOwner = dropContainer === birthContainer;
        let vertical;
        let dragRect;
        let targetRect;
        let revert;

        if (_silent) return;

        let capture = () => {
            this.captureAnimationState(dropContainer);
            if (dropContainer !== fromContainer) {
                this.captureAnimationState(fromContainer);
            }
        }

        let completed = (insertion) => {
            if (insertion) {

                if (dropContainer === birthContainer) {
                    this._hideClone();
                } else {
                    this._showClone(dropContainer);
                }

                if (dropContainer === fromContainer) {
                    this._ignoreWhileAnimating = target;
                }

                if (this.putContainer !== dropContainer && dropContainer !== birthContainer) {
                    this.putContainer = dropContainer;
                } else if (dropContainer === birthContainer && this.putContainer) {
                    this.putContainer = null;
                }

                this.animateAll(dropContainer, () => {
                    this._ignoreWhileAnimating = null;
                });
            }

            if ((target === dragEl && !dragEl.animated) || (target === dropContainer && !target.animated)) {
                lastTarget = null;
            }

            return true;
        }

        let changed = () => {
            this.newIndex = index(dragEl);
            this.newDraggableIndex = index(dragEl, `.${options.dragableClass}`);
        }

        if (evt.preventDefault !== void 0) {
            evt.cancelable && evt.preventDefault();
        }

        target = closest(target, `.${options.dragableClass}`, dropContainer, true);
        let { limit, put, sort, anticlass } = this.getDropContainerOptions(dropContainer);
        let { pull } = this.getDropContainerOptions(birthContainer);

        if (!target) return;

        if (this.dragEl.contains(evt.target) || target.animated && target.animatingX && target.animatingY ||
            this._ignoreWhileAnimating === target) {
            return completed(false);
        }

        if (isOwner
            ? sort || (revert = !birthContainer.contains(dragEl))
            : this.putContainer === dropContainer || (put && (dropContainer.putMode = pull) && this.withInLimit(dropContainer, limit) && !(anticlass && $(dragEl).hasClass(anticlass)))
        ) {
            vertical = this._detectDirection(dropContainer, options) === 'vertical';
            dragRect = getRect(dragEl);

            if (revert) {
                parentEl = birthContainer;

                sort && capture();

                this._hideClone();

                if (this.nextEl) {
                    birthContainer.insertBefore(dragEl, this.nextEl);
                } else {
                    birthContainer.appendChild(dragEl);
                }

                return completed(true);
            }

            let dropCtrLastChild = lastChild(dropContainer, `.${options.dragableClass}`);
            if (!dropCtrLastChild || this._ghostIsLast(evt, vertical, dropContainer) && !dropCtrLastChild.animated) {

                if (dropCtrLastChild === dragEl) {
                    return completed(false);
                }

                if (dropCtrLastChild && dropContainer === evt.target) {
                    target = dropCtrLastChild;
                }

                capture();
                dropContainer.appendChild(dragEl);
                parentEl = dropContainer;
                changed();
                return completed(true);
            } else if (target.parentNode === dropContainer) {
                targetRect = getRect(target);

                let direction = 0,
                    targetBeforeFirstSwap,
                    differentLevel = dragEl.parentNode !== dropContainer,
                    differentRowCol = !this._dragElInRowColumn(dragEl.animated && dragEl.toRect || dragRect, target.animated && target.toRect || targetRect, vertical),
                    side1 = vertical ? 'top' : 'left',
                    scrolledPastTop = isScrolledPast(target, 'top', 'top') || isScrolledPast(dragEl, 'top', 'top'),
                    scrollBefore = scrolledPastTop ? scrolledPastTop.scrollTop : void 0;

                if (lastTarget !== target) {
                    targetBeforeFirstSwap = targetRect[side1];
                    pastFirstInvertThresh = false;
                    isCircumstantialInvert = (!differentRowCol && options.invertSwap) || differentLevel;
                }

                direction = this._getSwapDirection(
                    evt, target, targetRect, vertical,
                    differentRowCol ? 1 : options.swapThreshold,
                    options.invertedSwapThreshold == null ? options.swapThreshold : options.invertedSwapThreshold,
                    isCircumstantialInvert,
                    lastTarget === target
                );

                let sibling;

                if (direction !== 0) {
                    let dragIndex = index(dragEl);
                    do {
                        dragIndex -= direction;
                        sibling = fromContainer.children[dragIndex];
                    } while (sibling && (css(sibling, 'display') === 'none' || sibling === this.ghostEl));
                }

                if (
                    direction === 0 ||
                    sibling === target
                ) {
                    return completed(false);
                }

                lastTarget = target;
                lastDirection = direction;

                let nextSibling = target.nextElementSibling;
                let after = false;
                after = direction === 1;

                _silent = true;
                setTimeout(_unsilent, 30);

                capture();
                if (after && !nextSibling) {
                    dropContainer.appendChild(dragEl);
                } else {
                    dropContainer.insertBefore(dragEl, after ? nextSibling : target);
                }

                if (scrolledPastTop) {
                    scrollBy(scrolledPastTop, 0, scrollBefore - scrolledPastTop.scrollTop);
                }

                parentEl = dragEl.parentNode;

                if (targetBeforeFirstSwap !== undefined && !isCircumstantialInvert) {
                    targetMoveDistance = Math.abs(targetBeforeFirstSwap - getRect(target)[side1]);
                }

                changed();
                return completed(true);
            }

            if (dropContainer.contains(dragEl)) {
                return completed(false);
            }
        }
        return false;
    }

    static withInLimit(el, limit) {
        if (limit === void 0 || limit === null) return true;
        let children = [].slice.call(el.children);
        var transCount = 0;
        children.forEach(item => {
            transCount += (item === this.ghostEl ? 1 : 0);
        })
        return children.length < (parseInt(limit) + transCount) ? true : false;
    }

    static getDropContainerOptions(container) {
        let limit = container.getAttribute('limit');
        let pull = container.getAttribute('pull');
        let put = container.getAttribute('put');
        let sort = container.getAttribute('sort');
        let anticlass = container.getAttribute('anticlass') || '';

        return { limit, pull: pull === 'false' ? false : pull, put: put === 'false' ? false : true, sort: sort === 'false' ? false : true, anticlass };
    }

    static _offMoveEvents() {
        off(document, 'mousemove', this._onTouchMove);
        off(document, 'touchmove', this._onTouchMove);
        off(document, 'pointermove', this._onTouchMove);
    }

    static _offUpEvents() {
        off(document, 'mouseup', this._onDrop);
        off(document, 'touchend', this._onDrop);
        off(document, 'pointerup', this._onDrop);
        off(document, 'touchcancel', this._onDrop);
        off(document, 'selectstart', this);
    }

    static _dispatchEvent(params) {

        let { name, toEl, fromEl, oldIndex, newIndex, originalEvent } = params;

        let evt;
        let options = this.options;
        let onName = 'on' + name.charAt(0).toUpperCase() + name.substr(1);

        if (window.CustomEvent && !IE11OrLess && !Edge) {
            evt = new CustomEvent(name, {
                bubbles: true,
                cancelable: true
            });
        } else {
            evt = document.createEvent('Event');
            evt.initEvent(name, true, true);
        }

        evt.to = toEl || this.birthContainer;
        evt.from = fromEl || this.birthContainer;
        evt.item = this.dragEl;
        evt.clone = this.cloneEl;

        evt.oldIndex = oldIndex || this.oldIndex;
        evt.newIndex = newIndex || this.newIndex;

        evt.originalEvent = originalEvent;
        evt.pullMode = this.putContainer ? this.putContainer.putMode : undefined;

        if (this.birthContainer) {
            this.birthContainer.dispatchEvent(evt);
        }

        if (options[onName]) {
            options[onName].call(this, evt);
        }
    }

    static _onDrop(evt) {
        let dragEl = this.dragEl;
        let cloneEl = this.cloneEl;
        let options = this.options;

        let newIndex = this.newIndex = index(dragEl);
        this.newDraggableIndex = index(dragEl, `.${options.dragableClass}`);

        parentEl = dragEl && dragEl.parentNode;

        awaitingDragStarted = false;
        isCircumstantialInvert = false;
        pastFirstInvertThresh = false;

        clearInterval(this._loopId);
        _cancelNextTick(this._dragStartId);

        this._offMoveEvents();
        this._offUpEvents();

        if (Safari) {
            css(document.body, 'user-select', '');
        }

        css(dragEl, 'transform', '');

        if (evt) {
            if (moved) {
                evt.cancelable && evt.preventDefault();
            }

            if (this.birthContainer === parentEl || (this.putContainer && this.putContainer.putMode !== 'clone')) {
                cloneEl && cloneEl.parentNode && cloneEl.parentNode.removeChild(cloneEl);
            }

            if (dragEl) {

                _disableDraggable(dragEl);
                dragEl.style['will-change'] = '';

                if (this.birthContainer !== parentEl) {
                    if (newIndex >= 0) {
                        this._dispatchEvent({
                            name: 'add',
                            toEl: parentEl,
                            originalEvent: evt
                        });
                    }
                } else {
                    if (newIndex !== this.oldIndex) {
                        if (newIndex >= 0) {
                            this._dispatchEvent({
                                name: 'update',
                                originalEvent: evt
                            });
                        }
                    }
                }
            }
            this.ghostEl && this.ghostEl.parentNode && this.ghostEl.parentNode.removeChild(this.ghostEl);
        }
        this._nulling();
    }

    static _nulling() {
        this.birthContainer = null;
        this.dragEl = null;
        this.dragEl = null;
        this.ghostEl = null;
        this.nextEl = null;
        this.cloneEl = null;
        this.tapEvt = null;
        this.touchEvt = null;
        this.newIndex = null;
        this.newDraggableIndex = null;
        this.oldIndex = null;
        this.oldDraggableIndex = null;
        this.putContainer = null;

        parentEl = null;
        lastDownEl = null;
        cloneHidden = null;
        moved = null;
        lastTarget = null;
        lastDirection = null;

        lastDx = lastDy = 0;
    }

    static _dragElInRowColumn(dragRect, targetRect, vertical) {
        let dragElS1Opp = vertical ? dragRect.left : dragRect.top,
            dragElS2Opp = vertical ? dragRect.right : dragRect.bottom,
            dragElOppLength = vertical ? dragRect.width : dragRect.height,
            targetS1Opp = vertical ? targetRect.left : targetRect.top,
            targetS2Opp = vertical ? targetRect.right : targetRect.bottom,
            targetOppLength = vertical ? targetRect.width : targetRect.height;

        return (
            dragElS1Opp === targetS1Opp ||
            dragElS2Opp === targetS2Opp ||
            (dragElS1Opp + dragElOppLength / 2) === (targetS1Opp + targetOppLength / 2)
        );
    }

    static _isOutsideThisEl(container, target) {
        if (!container.contains(target) && target !== container) {
            lastTarget = null;
        }
    }

    static _hideClone() {
        if (!cloneHidden) {

            css(this.cloneEl, 'display', 'none');
            if (this.options.removeCloneOnHide && this.cloneEl.parentNode) {
                this.cloneEl.parentNode.removeChild(this.cloneEl);
            }
            cloneHidden = true;
        }
    }

    static _showClone(dropContainer) {
        if (dropContainer.putMode !== 'clone') {
            this._hideClone();
            return;
        }

        let container = this.birthContainer;
        if (cloneHidden) {
            if (container.contains(this.dragEl)) {
                container.insertBefore(this.cloneEl, this.dragEl);
            } else if (this.nextEl) {
                container.insertBefore(this.cloneEl, this.nextEl);
            } else {
                container.appendChild(this.cloneEl);
            }
            css(this.cloneEl, 'display', '');
            cloneHidden = false;

            //todo:为了刷新组件菜单临时想到的方法,后面可能要优化
            this._dispatchEvent({
                name: 'showclone'
            });
        }
    }

    static _ghostIsLast(evt, vertical, container) {
        let rect = getRect(lastChild(container, `.${this.options.dragableClass}`));
        const spacer = 10;

        return vertical ?
            (evt.clientX > rect.right + spacer || evt.clientX <= rect.right && evt.clientY > rect.bottom && evt.clientX >= rect.left) :
            (evt.clientX > rect.right && evt.clientY > rect.top || evt.clientX <= rect.right && evt.clientY > rect.bottom + spacer);
    }

    static _detectDirection(el, options) {
        let elCSS = css(el),
            elWidth = parseInt(elCSS.width) - parseInt(elCSS.paddingLeft) - parseInt(elCSS.paddingRight) - parseInt(elCSS.borderLeftWidth) - parseInt(elCSS.borderRightWidth),
            child1 = getChild(el, 0, options),
            child2 = getChild(el, 1, options),
            firstChildCSS = child1 && css(child1),
            secondChildCSS = child2 && css(child2),
            firstChildWidth = firstChildCSS && parseInt(firstChildCSS.marginLeft) + parseInt(firstChildCSS.marginRight) + getRect(child1).width,
            secondChildWidth = secondChildCSS && parseInt(secondChildCSS.marginLeft) + parseInt(secondChildCSS.marginRight) + getRect(child2).width;

        if (elCSS.display === 'flex') {
            return elCSS.flexDirection === 'column' || elCSS.flexDirection === 'column-reverse'
                ? 'vertical' : 'horizontal';
        }

        if (elCSS.display === 'grid') {
            return elCSS.gridTemplateColumns.split(' ').length <= 1 ? 'vertical' : 'horizontal';
        }

        if (child1 && firstChildCSS.float && firstChildCSS.float !== 'none') {
            let touchingSideChild2 = firstChildCSS.float === 'left' ? 'left' : 'right';

            return child2 && (secondChildCSS.clear === 'both' || secondChildCSS.clear === touchingSideChild2) ?
                'vertical' : 'horizontal';
        }

        return (child1 &&
            (
                firstChildCSS.display === 'block' ||
                firstChildCSS.display === 'flex' ||
                firstChildCSS.display === 'table' ||
                firstChildCSS.display === 'grid' ||
                firstChildWidth >= elWidth &&
                elCSS[CSSFloatProperty] === 'none' ||
                child2 &&
                elCSS[CSSFloatProperty] === 'none' &&
                firstChildWidth + secondChildWidth > elWidth
            ) ?
            'vertical' : 'horizontal'
        );
    }

    static _getInsertDirection(target) {
        if (index(this.dragEl) < index(target)) {
            return 1;
        } else {
            return -1;
        }
    }

    static _getSwapDirection(evt, target, targetRect, vertical, swapThreshold, invertedSwapThreshold, invertSwap, isLastTarget) {
        let mouseOnAxis = vertical ? evt.clientY : evt.clientX,
            targetLength = vertical ? targetRect.height : targetRect.width,
            targetS1 = vertical ? targetRect.top : targetRect.left,
            targetS2 = vertical ? targetRect.bottom : targetRect.right,
            invert = false;
        if (!invertSwap) {
            if (isLastTarget && targetMoveDistance < targetLength * swapThreshold) {
                if (!pastFirstInvertThresh &&
                    (lastDirection === 1 ?
                        (
                            mouseOnAxis > targetS1 + targetLength * invertedSwapThreshold / 2
                        ) :
                        (
                            mouseOnAxis < targetS2 - targetLength * invertedSwapThreshold / 2
                        )
                    )
                ) {
                    pastFirstInvertThresh = true;
                }

                if (!pastFirstInvertThresh) {
                    if (
                        lastDirection === 1 ?
                            (
                                mouseOnAxis < targetS1 + targetMoveDistance
                            ) :
                            (
                                mouseOnAxis > targetS2 - targetMoveDistance
                            )
                    ) {
                        return -lastDirection;
                    }
                } else {
                    invert = true;
                }
            } else {
                if (
                    mouseOnAxis > targetS1 + (targetLength * (1 - swapThreshold) / 2) &&
                    mouseOnAxis < targetS2 - (targetLength * (1 - swapThreshold) / 2)
                ) {
                    return this._getInsertDirection(target);
                }
            }
        }

        invert = invert || invertSwap;

        if (invert) {
            if (
                mouseOnAxis < targetS1 + (targetLength * invertedSwapThreshold / 2) ||
                mouseOnAxis > targetS2 - (targetLength * invertedSwapThreshold / 2)
            ) {
                return ((mouseOnAxis > targetS1 + targetLength / 2) ? 1 : -1);
            }
        }

        return 0;
    }
}

function _disableDraggable(el) {
    el.draggable = false;
}

function _unsilent() {
    _silent = false;
}

function _nextTick(fn) {
    return setTimeout(fn, 0);
}

function _cancelNextTick(id) {
    return clearTimeout(id);
}

export default DragAndDrop;