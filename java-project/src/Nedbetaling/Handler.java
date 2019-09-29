package Nedbetaling;

import java.io.BufferedInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;

import org.apache.cxf.helpers.IOUtils;

public class Handler {

	public static void main(String[] args) throws IOException {
		

		Handler.Post_JSON();
	}
	public static void Post_JSON() {
        String query_url = "https://visningsrom.stacc.com/dd_server_laaneberegning/rest/laaneberegning/v1/nedbetalingsplan";
        String json = "{" + 
				"\"laanebelop\":2000000," + 
				"\"nominellRente\":3," + 
				"\"terminGebyr\":30," + 
				"\"utlopsDato\":\"2045-01-01\"," + 
				"\"saldoDato\":\"2020-01-01\"," + 
				"\"datoForsteInnbetaling\":\"2020-02-01\"," + 
				"\"ukjentVerdi\":\"TERMINBELOP\"" + 
				"}";
        try {
        URL url = new URL(query_url);
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setConnectTimeout(5000);
        conn.setRequestProperty("Content-Type", "application/json; charset=UTF-8");
        conn.setDoOutput(true);
        conn.setDoInput(true);
        conn.setRequestMethod("POST");
        OutputStream os = conn.getOutputStream();
        os.write(json.getBytes("UTF-8"));
        os.close(); 
        // read the response
        InputStream in = new BufferedInputStream(conn.getInputStream());
        String result = IOUtils.toString(in, "UTF-8");
        System.out.println(result);
        
       
        NedbetalingWebService test = new NedbetalingWebService();
        test.getGjennomsnitt(result);
//        System.out.println("result after Reading JSON Response");
//        JSONObject myResponse = new JSONObject(result);
//        System.out.println("jsonrpc- "+myResponse.getString("jsonrpc"));
//        System.out.println("id- "+myResponse.getInt("id"));
//        System.out.println("result- "+myResponse.getString("result"));
        in.close();
        conn.disconnect();
        } catch (Exception e) {
			System.out.println(e);
		}
	}

}