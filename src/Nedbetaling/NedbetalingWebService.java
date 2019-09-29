package Nedbetaling;


import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;


@Path("nedbetaling")
public class NedbetalingWebService {

	public NedbetalingWebService() {
		
	}

    @Path("/plan")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public ResponseGetNedbetaling getGjennomsnitt(String json) throws JSONException {
    	ResponseGetNedbetaling response = new ResponseGetNedbetaling();
    	int avg = 0;
        if (!json.equals("")) {
           JSONObject obj = new JSONObject(json);
           int dato1 = Integer.parseInt(obj.getJSONObject("nedbetalingsplan").getJSONArray("innbetalinger").getJSONObject(obj.getJSONObject("nedbetalingsplan").getJSONArray("innbetalinger").length()-1).getString("dato").substring(0,4));
           for(int i = 0;i<obj.getJSONObject("nedbetalingsplan").getJSONArray("innbetalinger").length(); i++) {
        	  JSONObject object = obj.getJSONObject("nedbetalingsplan").getJSONArray("innbetalinger").getJSONObject(i);
        	  
        	  
           
           String dato = object.getString("dato");
           double innbetaling = object.getDouble(("innbetaling"));
           
  
            avg += innbetaling/((dato1-2019)*12);
           }
           System.out.println("Gjennomsnittsprisen per måned får lånet er: " + avg);
        }
        response.setAvg(avg);
        return response;
    }

}
