import isScrolledIntoView from './isScrolledIntoView';

export default function onScrollAnimate() {    
    document.querySelectorAll('[data-animate="false"]').forEach((item) => {
        if (item && isScrolledIntoView(item) === true) {
            item.setAttribute('data-animate', 'true');
            if (item.getAttribute('data-delay')) {
                let index = 0;
                const siblings = document.querySelectorAll(
                    '[data-delay="true"]',
                );
                siblings.forEach((item1, i) => {
                    /* eslint eqeqeq: "off" */
                    if (item == item1) {
                        /* eslint no-param-reassign: "error" */
                        index = i;
                    }
                });
                const timeOut = 0 + 150 * index;

                setTimeout(() => {
                    /* eslint no-param-reassign: 'off' */
                    item.setAttribute('data-delay', 'false');
                }, timeOut);
            }
        }
    });
}