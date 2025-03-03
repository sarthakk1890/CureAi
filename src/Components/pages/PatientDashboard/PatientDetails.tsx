import { FaUser, FaEnvelope, FaPhone, FaUserMd, FaVenusMars } from 'react-icons/fa';
import { GiDroplets } from 'react-icons/gi';

interface IPatientDetails {
    age: number;
    bloodGroup: string | null;
    email: string;
    gender: "male" | "female" | "other";
    id: string;
    image: string;
    name: string;
    phone: string;
    role: string;
}

const PatientDetails: React.FC<{ patient: IPatientDetails }> = ({ patient }) => {
    const details = [
        { icon: FaUser, label: 'Name', value: patient.name },
        { icon: FaEnvelope, label: 'Email', value: patient.email },
        { icon: FaPhone, label: 'Phone', value: patient.phone },
        { icon: FaUserMd, label: 'Age', value: `${patient.age} years` },
        { icon: GiDroplets, label: 'Blood Group', value: patient.bloodGroup },
        { icon: FaVenusMars, label: 'Gender', value: patient.gender?.toUpperCase() }
    ];

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center space-x-6 mb-6">
                <img
                    src={patient.image}
                    alt={patient.name}
                    className="w-24 h-24 rounded-full"
                />
                <div>
                    <h2 className="text-2xl font-semibold text-primary-dark">{patient.name}</h2>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {details.map((detail, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-primary-light rounded-lg">
                        <detail.icon className="w-5 h-5 text-primary" />
                        <div>
                            <p className="text-sm text-text-light">{detail.label}</p>
                            <p className="font-medium text-primary-dark">{detail.value}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PatientDetails;