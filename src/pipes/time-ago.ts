import { Pipe, PipeTransform } from "@angular/core";
/*
 * Elapsed time since date
 * Usage:
 *   date | emTimeAgo
*/

@Pipe({
  name: 'emTimeAgo'
})
export class TimeAgoPipe implements PipeTransform {
  transform(date: string): string {
    let now = Date.now();
	let then = new Date(date);
	var diffMs = (now - then.getTime()); // milliseconds between now & then
	let diffDays = Math.round(diffMs / 86400000); // days
	let diffHrs = Math.round((diffMs % 86400000) / 3600000); // hours
	let diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes
	//let diffSecs = Math.round((((diffMs % 86400000) % 3600000) / 60000) / 60); // minutes

	var monthNames = [
	  "Janeiro", "Fevereiro", "Março",
	  "Abril", "Maio", "Junho", "Julho",
	  "Agosto", "Setembro", "Outubro",
	  "Novembro", "Dezembro"
	];

	let ret = '';

	if(diffDays == 0 && diffHrs == 0 && diffMins == 0)
	{
		ret = 'alguns segundos atrás';
	}
	else if(diffDays == 0 && diffHrs == 0 && diffMins > 0 && diffMins < 5 )
	{
		ret = 'alguns minutos atrás';
	}
	else if(diffDays == 0 && diffHrs > 0)
	{
		ret = diffHrs + ((diffHrs > 1) ? ' horas':' hora' ) + ' atrás';
	}
	else if(diffDays > 1 && diffDays < 3)
	{
		ret = diffDays + ((diffDays > 1) ? ' dias':' dia' ) + ' atrás';
	}
	else
	{
		//ret = diffDays + ((diffDays > 1) ? ' dias':' dia' ) + ' atrás';
		let day = then.getDate();
		let monthIndex = then.getMonth();
		let year = then.getFullYear();
		ret = day + ' ' + monthNames[monthIndex] + ' ' + year;
	}

	return ret;
	//diffDays + " dias, " + diffHrs + " horas, e " + diffMins + " minutos atrás."; 
  }
}