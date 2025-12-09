import Swal from "sweetalert2";

// ارور با دکمه تایید
export function SwalError(title, text, icon = "error", outclick = true, myFunction = null) {
    Swal.fire({
        title,
        text,
        icon,
        allowOutsideClick: outclick,
        showCancelButton: true,
        confirmButtonColor: "#2AE78B",
        cancelButtonColor: "#E93030",
        confirmButtonText: "تلاش مجدد",
        cancelButtonText: "انصراف",
    }).then((result) => {
        if (result.isConfirmed && myFunction) {
            myFunction();
        }
    });
}


export function SwalErrorSplash(title, text, icon = "error", outclick = true, myFunction = null) {
  Swal.fire({
    title,
    text,
    icon,
    allowOutsideClick: outclick,
    showCancelButton: false,
    confirmButtonColor: "#2AE78B",
    confirmButtonText: "باشه",
  }).then((result) => {
    if (result.isConfirmed && myFunction) {
      myFunction();
    }
  });
}

export function SwalUpdateSplash(title, text, icon = "error", outclick = true, myFunction = null, redirectUrl = null) {
  Swal.fire({
    title,
    text,
    icon,
    allowOutsideClick: outclick,
    showCancelButton: false,
    confirmButtonColor: "#2AE78B",
    confirmButtonText: " بروزرسانی",
  }).then((result) => {
    if (result.isConfirmed) {
      if (myFunction) {
        myFunction();
      }
      if (redirectUrl) {
        window.location.href = redirectUrl;
      }
    }
  });
}



// موفقیت ساده
export function SwalSuccess(title = "موفق!", text = "", timer = 2000) {
  return Swal.fire({
    title,
    text,
    icon: "success",
    showConfirmButton: false,
    timer,
  })
}

// پیام تایید حذف یا انجام اکشن
export function SwalConfirm(title, text, confirmText = "بله، انجام بده", cancelText = "انصراف", onConfirm) {
    Swal.fire({
        title,
        text,
        icon: "question",
        showCancelButton: true,
      confirmButtonColor: "#2AE78B",
      cancelButtonColor: "#E93030",
        confirmButtonText: confirmText,
        cancelButtonText: cancelText,
    }).then((result) => {
        if (result.isConfirmed) {
            onConfirm();
        }
    });
}

// پیام لودینگ (برای درخواست‌های طولانی)
export function SwalLoading(title = "لطفاً صبر کنید...", text = "") {
    Swal.fire({
        title,
        text,
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
            Swal.showLoading();
        },
    });
}

// بستن Swal دستی (مثلاً بعد از پایان عملیات async)
export function SwalClose() {
    Swal.close();
}

// پیام سفارشی
export function SwalCustom(options = {}) {
    Swal.fire({
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        ...options,
    });
}
