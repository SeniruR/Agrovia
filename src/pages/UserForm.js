import { Grid } from "@mui/material"

const UserForm = props => {
    return (
        <Grid 
            container
            spacing={2}
            sx={{
                padding: 2,
                backgroundColor: '#f5f5f5',
                borderRadius: 1,
                boxShadow: 1
            }}
        >
            <Grid item xs = {12}>
                <h2>User Form</h2>    
            </Grid>

            <Grid>
                <form>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <input type="text" placeholder="First Name" required />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <input type="text" placeholder="Last Name" required />
                        </Grid>
                        <Grid item xs={12}>
                            <input type="email" placeholder="Email" required />
                        </Grid>
                        <Grid item xs={12}>
                            <button type="submit"
                                sx={{
                                    backgroundColor: '#1976d2',
                                    color: '#fff',
                                    padding: '10px 20px',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    '&:hover': {
                                        backgroundColor: '#115293'
                                    }
                                }}
                            >Submit</button>
                        </Grid>
                    </Grid>
                </form>
            </Grid>
        </Grid>
    );
}

export default UserForm;