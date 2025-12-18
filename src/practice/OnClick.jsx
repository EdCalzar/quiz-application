export default function OnClick() {
    
    const handleClick = () => {
        console.log('Button clicked')
    }

    return (
        <>
            <button onClick={handleClick}>Click me</button>
        </>
    )
}