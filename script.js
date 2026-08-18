/* =========================================
   CHOR TOPUP
   Main JavaScript
   ========================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* -----------------------------------------
       Elements
       ----------------------------------------- */

    const form = document.getElementById("topupForm");

    const game = document.getElementById("game");
    const playerId = document.getElementById("playerId");

    const packages = document.querySelectorAll(".package");

    const summaryGame =
        document.getElementById("summaryGame");

    const summaryId =
        document.getElementById("summaryId");

    const summaryPackage =
        document.getElementById("summaryPackage");

    const summaryPrice =
        document.getElementById("summaryPrice");

    const modal =
        document.getElementById("orderModal");

    const closeModal =
        document.getElementById("closeModal");

    const orderId =
        document.getElementById("orderId");

    const orderGame =
        document.getElementById("orderGame");

    const orderPlayerId =
        document.getElementById("orderPlayerId");

    const orderPackage =
        document.getElementById("orderPackage");

    const orderPayment =
        document.getElementById("orderPayment");

    const orderTotal =
        document.getElementById("orderTotal");

    const whatsappBtn =
        document.getElementById("whatsappBtn");

    const copyOrder =
        document.getElementById("copyOrder");

    const toast =
        document.getElementById("toast");

    const menuBtn =
        document.getElementById("menuBtn");

    const mobileMenu =
        document.getElementById("mobileMenu");


    /* -----------------------------------------
       State
       ----------------------------------------- */

    let selectedPackage = null;

    let lastOrderText = "";

    /* -----------------------------------------
       Mobile Menu
       ----------------------------------------- */

    menuBtn.addEventListener("click", () => {

        const isOpen =
            mobileMenu.classList.toggle("open");

        mobileMenu.style.display =
            isOpen ? "flex" : "none";

        menuBtn.textContent =
            isOpen ? "×" : "☰";
    });


    document
        .querySelectorAll(".mobile-menu a")
        .forEach(link => {

            link.addEventListener("click", () => {

                mobileMenu.style.display = "none";
                mobileMenu.classList.remove("open");

                menuBtn.textContent = "☰";
            });

        });


    /* -----------------------------------------
       Package Selection
       ----------------------------------------- */

    packages.forEach(packageBtn => {

        packageBtn.addEventListener("click", () => {

            packages.forEach(btn => {
                btn.classList.remove("active");
            });

            packageBtn.classList.add("active");

            selectedPackage = {
                diamonds:
                    packageBtn.dataset.diamonds,

                price:
                    Number(packageBtn.dataset.price)
            };

            updateSummary();

        });

    });


    /* -----------------------------------------
       Inputs
       ----------------------------------------- */

    game.addEventListener(
        "change",
        updateSummary
    );

    playerId.addEventListener(
        "input",
        updateSummary
    );


    /* -----------------------------------------
       Summary Update
       ----------------------------------------- */

    function updateSummary() {

        summaryGame.textContent =
            game.value || "—";

        summaryId.textContent =
            playerId.value.trim() || "—";


        if (selectedPackage) {

            summaryPackage.textContent =
                `${selectedPackage.diamonds} Diamonds`;

            summaryPrice.textContent =
                `৳${selectedPackage.price}`;

        } else {

            summaryPackage.textContent =
                "—";

            summaryPrice.textContent =
                "৳0";
        }
    }


    /* -----------------------------------------
       Generate Order ID
       ----------------------------------------- */

    function generateOrderId() {

        const now = new Date();

        const date =
            now
                .toISOString()
                .slice(0, 10)
                .replaceAll("-", "");

        const random =
            Math.floor(
                1000 +
                Math.random() * 9000
            );

        return `CT-${date}-${random}`;
    }


    /* -----------------------------------------
       Form Submit
       ----------------------------------------- */

    form.addEventListener("submit", event => {

        event.preventDefault();


        if (!game.value) {

            showToast(
                "Please select a game."
            );

            game.focus();

            return;
        }


        if (!playerId.value.trim()) {

            showToast(
                "Please enter your Player ID."
            );

            playerId.focus();

            return;
        }


        if (!selectedPackage) {

            showToast(
                "Please select a package."
            );

            return;
        }


        const payment =
            document.querySelector(
                'input[name="payment"]:checked'
            );


        if (!payment) {

            showToast(
                "Please select a payment method."
            );

            return;
        }


        const id =
            generateOrderId();

        const paymentMethod =
            payment.value;

        const player =
            playerId.value.trim();

        const packageName =
            `${selectedPackage.diamonds} Diamonds`;

        const price =
            selectedPackage.price;


        /* -------------------------------------
           Modal Details
           ------------------------------------- */

        orderId.textContent =
            id;

        orderGame.textContent =
            game.value;

        orderPlayerId.textContent =
            player;

        orderPackage.textContent =
            packageName;

        orderPayment.textContent =
            paymentMethod;

        orderTotal.textContent =
            `৳${price}`;


        /* -------------------------------------
           WhatsApp Message
           ------------------------------------- */

        lastOrderText =
`CHOR TOPUP ORDER

Order ID: ${id}
Game: ${game.value}
Player ID: ${player}
Package: ${packageName}
Payment: ${paymentMethod}
Total: ৳${price}

Please confirm my order.`;


        /*
         * IMPORTANT:
         * Replace 8801XXXXXXXXX with your real
         * WhatsApp number.
         */

        const whatsappNumber =
            "8801XXXXXXXXX";


        const whatsappUrl =
            `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(lastOrderText)}`;


        whatsappBtn.href =
            whatsappUrl;


        /* -------------------------------------
           Save order locally
           ------------------------------------- */

        saveOrder({
            orderId: id,
            game: game.value,
            playerId: player,
            package: packageName,
            payment: paymentMethod,
            total: price,
            createdAt:
                new Date().toISOString()
        });


        /* -------------------------------------
           Show modal
           ------------------------------------- */

        modal.classList.add("show");

        document.body.style.overflow = "hidden";

    });


    /* -----------------------------------------
       Close Modal
       ----------------------------------------- */

    function closeOrderModal() {

        modal.classList.remove("show");

        document.body.style.overflow = "";

    }


    closeModal.addEventListener(
        "click",
        closeOrderModal
    );


    modal.addEventListener(
        "click",
        event => {

            if (event.target === modal) {
                closeOrderModal();
            }

        }
    );


    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape" &&
                modal.classList.contains("show")
            ) {

                closeOrderModal();

            }

        }
    );


    /* -----------------------------------------
       Copy Order
       ----------------------------------------- */

    copyOrder.addEventListener(
        "click",
        async () => {

            if (!lastOrderText) {
                return;
            }

            try {

                await navigator.clipboard.writeText(
                    lastOrderText
                );

                showToast(
                    "Order copied!"
                );

            } catch (error) {

                showToast(
                    "Copy failed."
                );

            }

        }
    );


    /* -----------------------------------------
       Save Order
       ----------------------------------------- */

    function saveOrder(order) {

        let orders = [];

        try {

            orders =
                JSON.parse(
                    localStorage.getItem(
                        "chorTopupOrders"
                    )
                ) || [];

        } catch (error) {

            orders = [];

        }


        orders.unshift(order);


        /*
         * Keep latest 20 orders
         */

        orders =
            orders.slice(0, 20);


        localStorage.setItem(
            "chorTopupOrders",
            JSON.stringify(orders)
        );

    }


    /* -----------------------------------------
       Toast
       ----------------------------------------- */

    let toastTimer;

    function showToast(message) {

        const toastText =
            toast.querySelector("p");

        toastText.textContent =
            message;

        toast.classList.add("show");

        clearTimeout(toastTimer);

        toastTimer =
            setTimeout(() => {

                toast.classList.remove(
                    "show"
                );

            }, 2600);

    }


    /* -----------------------------------------
       FAQ
       ----------------------------------------- */

    document
        .querySelectorAll(".faq-question")
        .forEach(question => {

            question.addEventListener(
                "click",
                () => {

                    const item =
                        question.parentElement;

                    document
                        .querySelectorAll(".faq-item")
                        .forEach(other => {

                            if (
                                other !== item
                            ) {

                                other.classList.remove(
                                    "active"
                                );

                            }

                        });


                    item.classList.toggle(
                        "active"
                    );

                }
            );

        });


    /* -----------------------------------------
       Current Year
       ----------------------------------------- */

    document.getElementById(
        "year"
    ).textContent =
        new Date().getFullYear();


    /* -----------------------------------------
       Prevent Empty Spaces in ID
       ----------------------------------------- */

    playerId.addEventListener(
        "blur",
        () => {

            playerId.value =
                playerId.value.trim();

            updateSummary();

        }
    );


    /* -----------------------------------------
       Initial State
       ----------------------------------------- */

    updateSummary();

});
