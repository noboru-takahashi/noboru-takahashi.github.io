(() => {
    "use strict";

    const works = Object.freeze({
        "terayama-cover": Object.freeze({
            title: "1993 「寺山修司：反逆から様式へ」表紙",
            dzi: "assets/dzi/terayama-cover/image.dzi",
            pdf: "assets/terayama_cover.pdf"
        }),
        "terayama-spread": Object.freeze({
            title: "1993 「寺山修司：反逆から様式へ」見開き",
            dzi: "assets/dzi/terayama-spread/image.dzi",
            pdf: "assets/terayama_a3.pdf"
        }),
        "kotoba": Object.freeze({
            title: "1993 「言葉だけでは困ります」",
            dzi: "assets/dzi/kotoba/image.dzi",
            pdf: "assets/kotoba.pdf",
            maxZoomPixelRatio: 1
        }),
        "nec-qp": Object.freeze({
            title: "1996 産業広告大賞銅賞 NEC QP",
            dzi: "assets/dzi/nec-qp/image.dzi",
            pdf: "assets/1996_NEC_QP.pdf",
            maxZoomPixelRatio: 1
        })
    });

    const titleElement = document.getElementById("work-title");
    const backLink = document.getElementById("back-link");
    const pdfLink = document.getElementById("pdf-link");
    const viewerElement = document.getElementById("openseadragon");
    const errorElement = document.getElementById("viewer-error");

    backLink.addEventListener("click", (event) => {
        if (document.referrer) {
            event.preventDefault();
            window.history.back();
        }
    });

    const showError = (message) => {
        viewerElement.hidden = true;
        pdfLink.hidden = true;
        errorElement.textContent = message;
        errorElement.hidden = false;
    };

    const workId = new URLSearchParams(window.location.search).get("work");
    const work = workId ? works[workId] : undefined;

    if (!work) {
        titleElement.textContent = "作品が見つかりません";
        document.title = "作品が見つかりません | Noboru Takahashi";
        showError("指定された作品は存在しません。作品一覧へ戻って選び直してください。");
        return;
    }

    titleElement.textContent = work.title;
    document.title = `${work.title} | Noboru Takahashi`;
    pdfLink.href = work.pdf;

    if (typeof window.OpenSeadragon !== "function") {
        showError("画像ビューアを読み込めませんでした。ページを再読み込みしてください。");
        return;
    }

    const viewer = window.OpenSeadragon({
        id: "openseadragon",
        prefixUrl: "vendor/openseadragon/images/",
        tileSources: work.dzi,
        showNavigator: false,
        showNavigationControl: true,
        showZoomControl: true,
        showHomeControl: true,
        showFullPageControl: true,
        showRotationControl: false,
        homeFillsViewer: false,
        preserveViewport: false,
        constrainDuringPan: true,
        visibilityRatio: 1,
        minZoomImageRatio: 1,
        maxZoomPixelRatio: work.maxZoomPixelRatio ?? 2,
        animationTime: 0.8,
        blendTime: 0.1,
        gestureSettingsMouse: {
            clickToZoom: false,
            dblClickToZoom: true,
            dragToPan: true,
            scrollToZoom: true
        },
        gestureSettingsTouch: {
            clickToZoom: false,
            dblClickToZoom: true,
            dragToPan: true,
            pinchToZoom: true,
            flickEnabled: true
        }
    });

    viewer.addHandler("open", () => {
        viewer.viewport.goHome(true);
        viewer.canvas.setAttribute("tabindex", "0");
    });

    viewer.addHandler("open-failed", () => {
        viewer.destroy();
        showError("作品画像を読み込めませんでした。しばらくしてから再度お試しください。");
    });
})();
