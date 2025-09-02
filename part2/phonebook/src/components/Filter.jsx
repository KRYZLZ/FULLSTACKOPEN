export const Filter = ({ search, setSearch }) => {
    const handleSearchChange = (event) => {
        setSearch(event.target.value)
    }

    return (
        <div>
            filter shown with <input value={search} onChange={handleSearchChange} />
        </div>
    )
}
