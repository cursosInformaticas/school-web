import Swal, { SweetAlertIcon } from 'sweetalert2';

export class Alerts {
  /*=============================================
	Función para alerta básica
	=============================================*/
  static confirmBasicAlert(title: string, text: string, icon: SweetAlertIcon) {
    Swal.fire({
      title: title,
      text: text,
      icon: icon,
      confirmButtonColor: '#015DAD',
      allowOutsideClick: false,
    });
  }

  /*=============================================
	Función para alertas con confirmación
	=============================================*/
  static confirmDeleteAlert(title: string, text: string, icon: SweetAlertIcon, confirmButtonText: string) {
    return Swal.fire({
      title: title,
      text: text,
      icon: icon,
      showCancelButton: true,
      confirmButtonColor: '#015DAD',
      cancelButtonColor: '#d33',
      confirmButtonText: confirmButtonText,
      allowOutsideClick: false,
    });
  }

  static ErrorCargaMasivaAlert(title: string, text: string, icon: SweetAlertIcon, confirmButtonText: string) {
    return Swal.fire({
      title: title,
      text: text,
      icon: icon,
      showCloseButton: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: confirmButtonText,
      allowOutsideClick: false,
    });
  }

  /*=============================================
	Función para alerta básica
	=============================================*/
  static saveAlert(title: string, text: string, icon: SweetAlertIcon) {
    return Swal.fire(title, text, icon);
  }
}
