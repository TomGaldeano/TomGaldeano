package java_pj;

public class list {
    // made to simulate a version of append in python lists and make the adding of elements efficiently by mortizinzing complexity.
    private static int items =0;
    public static int[] append(int item, int[] list){
        if(list.length == items){
            int[] liste = new int[items*2]; 
            liste[items]=item;
            items++;
            for(int i =0;i<list.length;i++)
                liste[i]=list[i];
            return liste;
        }else{
            list[items]=item;
            items++;
            return list;
            
        }

    }
    public static void main(String[] args) {
        int[] list  = new int[4];
        for(int i = 0;i<10;i++){
            list = append(i,list);
            for(int j=0;j<list.length;j++){
                System.out.print(list[j]+" ");
                
            }
            System.out.println("--"+items);
        }
    }
}
