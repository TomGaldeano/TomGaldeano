package claseU3;

public class H2E6 {

	public static void main(String[] args) {
		final int MAX_COUNT = 101;
		int cont = 1;
		int sum = 0;
		while (cont<MAX_COUNT) {
			sum += cont;
			cont += 1;			
		}
		System.out.println(sum);

	}
}
