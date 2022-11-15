import React from "react";

import { Formik, Form, Field, FormikProps } from "formik";
import { XIcon } from "miruIcons";
import * as Yup from "yup";

import clientApi from "apis/clients";
import Toastr from "common/Toastr";

const newClientSchema = Yup.object().shape({
  name: Yup.string().required("Name cannot be blank"),
  email: Yup.string().email("Invalid email ID").required("Email ID cannot be blank"),
  phone: Yup.number().typeError("Invalid phone number"),
  address: Yup.string().required("Address cannot be blank")
});

const initialValues = {
  name: "",
  email: "",
  phone: "",
  address: ""
};

interface FormValues {
  name: string;
  email: string;
  phone: string;
  address: string;
}

const EditClient = ({ setnewClient, clientData, setClientData }) => {
  const handleSubmit = (values) => {
    clientApi.create(values)
      .then(res => {
        setClientData([...clientData, { ...res.data, minutes: 0 }]);
        setnewClient(false);
        Toastr.success("Client added successfully");
      });
  };

  return (
    <div className="px-4 flex items-center justify-center">
      <div
        className="overflow-auto fixed top-0 left-0 right-0 bottom-0 inset-0 z-10 flex items-start justify-center"
        style={{
          backgroundColor: "rgba(29, 26, 49, 0.6)"
        }}
      >
        <div className="relative px-4 h-full w-full md:flex md:items-center md:justify-center">
          <div className="rounded-lg px-6 pb-6 bg-white shadow-xl transform transition-all sm:align-middle sm:max-w-md modal-width">
            <div className="flex justify-between items-center mt-6">
              <h6 className="text-base font-extrabold">Add New Client</h6>
              <button type="button" onClick={() => { setnewClient(false); }}>
                <XIcon size={16} color="#CDD6DF" weight="bold" />
              </button>
            </div>
            <Formik
              initialValues={initialValues}
              validationSchema={newClientSchema}
              onSubmit={handleSubmit}
            >
              {(props: FormikProps<FormValues>) => {
                const { touched, errors } = props;
                return (
                  <Form>
                    <div className="mt-4">
                      <div className="field">
                        <div className="field_with_errors">
                          <label className="form__label">Name</label>
                          <div className="tracking-wider block text-xs text-red-600">
                            {errors.name && touched.name &&
                              <div>{errors.name}</div>
                            }
                          </div>
                        </div>
                        <div className="mt-1">
                          <Field className={`form__input ${errors.name && touched.name && "border-red-600 focus:ring-red-600 focus:border-red-600"} `} name="name" />
                        </div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="field">
                        <div className="field_with_errors">
                          <label className="form__label">Email</label>
                          <div className="tracking-wider block text-xs text-red-600">
                            {errors.email && touched.email &&
                              <div>{errors.email}</div>
                            }
                          </div>
                        </div>
                        <div className="mt-1">
                          <Field className={`form__input ${errors.email && touched.email && "border-red-600 focus:ring-red-600 focus:border-red-600"} `} name="email" />
                        </div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="field">
                        <div className="field_with_errors">
                          <label className="form__label">Phone number</label>
                          <div className="tracking-wider block text-xs text-red-600">
                            {errors.phone && touched.phone &&
                              <div>{errors.phone}</div>
                            }
                          </div>
                        </div>
                        <div className="mt-1">
                          <Field className={`form__input ${errors.phone && touched.phone && "border-red-600 focus:ring-red-600 focus:border-red-600"} `} name="phone" />
                        </div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="field">
                        <div className="field_with_errors">
                          <label className="form__label">Address</label>
                          <div className="tracking-wider block text-xs text-red-600">
                            {errors.address && touched.address &&
                              <div>{errors.address}</div>
                            }
                          </div>
                        </div>
                        <div className="mt-1">
                          <Field className={`form__input p-2 h-12 ${errors.address && touched.address && "border-red-600 focus:ring-red-600 focus:border-red-600"} `} name="address" as='textarea' />
                        </div>
                      </div>
                    </div>
                    <div className="actions mt-4">
                      <input
                        type="submit"
                        name="commit"
                        value="SAVE CHANGES"
                        className="form__input_submit"
                      />
                    </div>
                  </Form>
                );
              }}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditClient;
