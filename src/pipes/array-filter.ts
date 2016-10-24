import { Pipe, PipeTransform } from "@angular/core";
 
@Pipe({
    name: "arrayFilter",
    pure: false
})
export class ArrayFilterPipe implements PipeTransform {
 
    transform(items: Array<any>, params: string): Array<any> {
        if(items == null || params == null) { return null; }  
        let query = params.toLowerCase();
        return items.filter(item =>
            item.name.toLowerCase().indexOf(query) > -1
            //item.category.name.toLowerCase().indexOf(query) > -1 ||
        );
    }
}