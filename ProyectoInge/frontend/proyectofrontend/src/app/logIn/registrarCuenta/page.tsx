import {SignUpForm} from "@/components/signup-form";

export default function RegistrarCuenta (){
  return(
    
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10  bg-amber-200/50 bg.transparent-50">
       <div className="w-full max-w-md">
          <SignUpForm/>
      </div>
    </div>
  )
};