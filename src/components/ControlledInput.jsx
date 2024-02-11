function ControlledInput({ placeholder, maxLength, name, currForm, setCurrForm, type }) {
    return (
        <input maxLength={maxLength} type={type} id={name}
        value={currForm[name]}
        placeholder={placeholder}
        onChange={(e) => {
            e.stopPropagation();
            const updatedValue = e.target.value;
            setCurrForm({...currForm, [name]: updatedValue});
        }}
        />
    )
}

export default ControlledInput;