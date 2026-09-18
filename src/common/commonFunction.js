export default class commonfunctions extends Component{

    constructor(props) {
      super(props);
      this.state={
        CompanyName:"",
        available_companies:""
      }
      AsyncStorage.getItem('databaseName', (err, result) => {
        // alert("AsyncStorage"+result)
        console.log(result);
  
        this.setState({CompanyName:result})
        
         available_companies = result.split(","); 
         this.setState({available_companies:available_companies})
        available_companies.forEach(element => {
          
        });
        // alert("c = "+available_companies[0]);
  
  
        
        
  
      });
  
    }

}