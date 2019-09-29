package Nedbetaling;


import java.util.List;
import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement
public class ResponseGetNedbetaling extends ServerResponse {
    private List<Steg> nedbetalingsplan;
	
    public ResponseGetNedbetaling(){}

    public List<Steg> getTasks() {
        return nedbetalingsplan;
    }

    public void setTasks(List<Steg> plan) {
        this.nedbetalingsplan = plan;
    }
}
