const HocHdUser = (WrappedComponent) => {
    return (
        class HocHdUser extends WrappedComponent {
            render() {
                return super.render();
            }

            handleSearchSubmit = (event) => {
                event.preventDefault();
                this.fetchTableData(1);
            }
        }
    )
}

export default HocHdUser;
