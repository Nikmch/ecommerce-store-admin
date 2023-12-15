import ProductForm from "@/components/ProductForm";
import Layout from "@/components/layout";
import axios from "axios";
import { useRouter } from "next/router";

export default function EditProductPage(){
    const [productInfo, setProductInfo] = useState(null);
    const router = useRouter();
    const {id} = router.query._id;
    useEffect(()=> {

        if (!id) {
            return; 
        }
axios.get('/api/products?id='+id).then(response => {
        setProductInfo(response.data);
    });
}, [id]);


    return(
        <Layout>
            <ProductForm {...productInfo} />
        </Layout>
    )
}