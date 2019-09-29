package Nedbetaling;


import java.util.List;
import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement
public class ResponseGetNedbetaling extends ServerResponse {
    private int average;
	
    public ResponseGetNedbetaling(){}

    public int getAvg() {
        return average;
    }

    public void setAvg(int avg) {
        this.average = avg;
    }
}
