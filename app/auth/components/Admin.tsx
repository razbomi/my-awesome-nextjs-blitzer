export function Welcome(props) {
    if (props.role === "admin") {
        return <> 
        <div>meow {props.name}</div>
        </>
    } else {
        return <>
        <div>woof {props.name}</div>
        </>
    }
}