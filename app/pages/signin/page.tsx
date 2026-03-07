"use client";

import {
  LockOutlined,
  MailOutlined,
} from "@ant-design/icons";
import {
  App,
  Button,
  Card,
  ConfigProvider,
  Form,
  Input,
  Typography,
  theme as antTheme,
} from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const { Title, Text } = Typography;

export default function SigninForm() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { message } = App.useApp();

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const response = await fetch("/api/v1/authenticate/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: values.email,
          password: values.password,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        message.success(result.message_th);
        router.p"use client";

import {
  LockOutlined,
  
import {
  ref  LockO
   MailOutlined;
} from "@ant-d
 import {
  App,
  Button,
ul  App,
ge  But
   Card,
    Confch  Form,
  Input,    Inpuag  Typog(e  theme as a| } from "antd";
impo?mport Link f?mport { useRouter } from "n?mport { useState } from "react";

const { {

const { Title, Text } = Typogra };
export default function SigninFor     const [loading, setLoading] = useStar  const router = useRouter();
  const { messagene  const { message } = App.uson
  const onFinish = async (values:},
    setLoaInput: { controlHeightLG: 54 },
      try {
      cons        co<d        method: "POST",
        headers: { "Content-Type": "applicr"        headers: { "Coter", padding: "40px 20px" }}>
        <Card
          styl          email: values.email00          password: values.paow        }),
      });

      const 
       });
ty
      cody
      if (response.ok) {
        message.div        message.successen        router.p"use client";

import  <div 
import {
  LockOutlined,
  F",  LockO 4  
import {
   bird  ref  s:   MailOutly:} from "@ant-d
 a import {
  Aen  App,
 st  Butntul  App,ntge  Butrg   Catom    Con>
  Input,    Inpupaimpo?mport Link f?mpo, fontWeight: "bold", fontSize:
const { {

const { Title, Text } = Typogra };
export default function SigninFor    fo
const {: 7export default function SigninFor? const { messagene  const { message } = App.uson
  const onFinish = async (values:},
    setLoaInput:  ? const onFinish = async (values:},
    setLoaIn??    setLoaInput: { controlHeightLGv>      try {
      cons        co<d      ni      conssh        headers: { "Content-Type": "applicr""e        <Card
          styl          email: values.email00          password: values.paow     ??         st??      });

      const 
       });
ty
      cody
      if (response.ok) {
        mess94A3B8" }} />       });
erty
      ?? ??      if           message.div      
import  <div 
import {
  LockOutlined,
  F",  LockO 4  true, message: "กimport {
  L? LockO? F",  LockO 4??import {
   bir
    bird   a import {
  Aen  App,
 st  Butntul  App,st  Aen  Appor st  Butnt"   Input,    Inpupaimpo?mport Link f?mpo," const { {

const { Title, Text } = Typogra };
export default function Sign 
const {imaexport default function SigninForadconst {: 7export default function Sign?? const onFinish = async (values:},
    setLoaInput:  ? const onFinish = async (values:},
  <d    setLoaInput:  ? const onFinisar    setLoaIn??    setLoaInput: { controlHeightLGv> ???     cons        co<d      ni      conssh        headers: {k           styl          email: values.email00          password: values.paow     ??         st??   </
      con      </div>
        </Card>
      </div>
    </ConfigProvider>
  );
}
