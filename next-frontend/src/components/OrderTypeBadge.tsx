import { OrderType } from "@/models";
import { Badge } from "flowbite-react";

export function OrderTypeBadge(props: {type: OrderType}) {
   return(
    <Badge color={props.type === OrderType.BUY ? "blue" : "red"}
    className="w-fit">
        {props.type === OrderType.BUY ? "Compra" : "Venda"}
    </Badge>
   );
}