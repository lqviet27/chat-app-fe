import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ResizableBox } from 'react-resizable';
import { BsGenderNeuter, BsPencil } from 'react-icons/bs';
import { Label } from '@headlessui/react';
import { format } from 'date-fns';
import { fetchUser, setUser } from '../../redux/actions/authActions';
import { userApi } from '../../api/api';
import { toast } from 'react-toastify';

const Profile = ({ closeProfile }) => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);
    const [name, setName] = useState(user?.name || '');
    const [bio, setBio] = useState(user?.profile?.bio || '');
    const [birthday, setBirthday] = useState(user?.profile?.birthday || '');
    const [gender, setGender] = useState(user?.profile?.gender || '');
    const [isEditing, setIsEditing] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [tempPicture, setTempPicture] = useState(user?.profile?.image || '');

    useEffect(() => {
        if (!user) {
            dispatch(fetchUser());
        }
    }, [dispatch, user]);

    useEffect(() => {
        if (user) {
            setName(user?.name || '');
            setBio(user?.profile?.bio || '');
            setBirthday(user?.profile?.birthday || '');
            setGender(user?.profile?.gender);
            setTempPicture(user.profile?.image || null);
        }
    }, [user]);

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return format(date, 'dd MMMM yyyy'); // Ví dụ định dạng: 01 January 2020
    };

    const handleSave = async (event) => {
        event.preventDefault();
        console.log('>>>submit');
        const updateProfile = {
            bio: bio,
            birthday: birthday,
            gender: gender,
            image: tempPicture,
        };
        const updateUser = { name, profile: updateProfile };
        console.log('>>> request updateUser', updateUser);
        try {
            const response = await userApi.updateUser(updateUser)
            console.log('>>> response updateUser', response);
            toast.success('Profile updated successfully');
            setIsEditing(false);
        } catch(err) {
            toast.error('Error updating profile');
            console.log('>>> Error updating profile', err);
        }
    };

    const uploadImageToCloudinary = (fileImage) => {
        if (!fileImage) return;
        const data = new FormData();
        data.append('file', fileImage);
        data.append('upload_preset', 'chatapp');
        data.append('cloud_name', 'duzqdd0rq');
        fetch('https://api.cloudinary.com/v1_1/duzqdd0rq/image/upload', {
            method: 'post',
            body: data,
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                setTempPicture(data.url.toString());
                dispatch(
                    setUser({
                        ...user,
                        profile: { ...user.profile, image: data.url.toString() },
                    }),
                );
            });
    };

    return (
        <div className="p-4 bg-gray-900 text-white h-full">
            <div className="flex justify-end">
                <button onClick={closeProfile} className="text-lg font-bold">
                    X
                </button>
            </div>
            <div className="flex flex-col items-center">
                <div className="w-24 h-24 bg-gray-700 rounded-full mb-4 relative">
                    {tempPicture ? (
                        <img src={tempPicture} alt="Profile" className="w-full h-full rounded-full object-cover" />
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <BsPencil className="text-2xl text-gray-400" />
                        </div>
                    )}
                    {isEditing && (
                        <label
                            htmlFor="imgInput"
                            className="absolute inset-0 flex items-center justify-center cursor-pointer bg-gray-700 bg-opacity-50 rounded-full"
                        >
                            {tempPicture ? ' ' : <BsPencil className="text-2xl text-white" />}
                            <input
                                type="file"
                                id="imgInput"
                                className="hidden"
                                onChange={(e) => uploadImageToCloudinary(e.target.files[0])}
                            />
                        </label>
                    )}
                </div>
                <h2 className="text-xl font-bold">{name || 'BK'}</h2>
                <p className="text-gray-400">{user?.status || 'Available'}</p>
            </div>
            {successMessage && <div className="text-green-500 text-center mb-4">{successMessage}</div>}
            {isEditing ? (
                <form
                    className="mt-4 space-y-4"
                    onSubmit={(e) => {
                        handleSave(e);
                    }}
                >
                    <div>
                        <label className="block text-sm">Name</label>
                        <input
                            type="text"
                            className="w-full p-2 bg-gray-800 text-white rounded-lg focus:outline-none"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm">Bio</label>
                        <input
                            type="text"
                            className="w-full p-2 bg-gray-800 text-white rounded-lg focus:outline-none"
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm">birthday</label>
                        <input
                            type="date"
                            className="w-full p-2 bg-gray-800 text-white rounded-lg focus:outline-none"
                            value={birthday}
                            onChange={(e) => setBirthday(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm">Gender</label>
                        {console.log(">> check gender", gender)}
                        <select
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                            className="w-full p-2 bg-gray-800 text-white rounded-lg"
                        >
                            <option value="">Select Gender</option>
                            <option value={true}>Male</option>
                            <option value={false}>Female</option>
                        </select>
                    </div>
                    <div className="flex justify-between">
                        <button type="button" onClick={() => setIsEditing(false)} className="text-gray-400">
                            Cancel
                        </button>
                        <button type="submit" className="text-white">
                            Save
                        </button>
                    </div>
                </form>
            ) : (
                <div className="mt-4 space-y-4">
                    <div>
                        <label className="block text-sm">Name</label>
                        <p className="w-full p-2 bg-gray-800 text-white rounded-lg">{name}</p>
                    </div>
                    <div>
                        <label className="block text-sm">Bio</label>
                        <p className="w-full p-2 bg-gray-800 text-white rounded-lg">{bio}</p>
                    </div>
                    <div>
                        <label className="block text-sm">birthday</label>
                        <p className="w-full p-2 bg-gray-800 text-white rounded-lg">{formatDate(birthday)}</p>
                    </div>
                    <div>
                        <label className="block text-sm">Gender</label>
                        <p className="w-full p-2 bg-gray-800 text-white rounded-lg">{gender ? 'Male' : 'Female'}</p>
                    </div>
                    <div className="flex justify-end">
                        <button onClick={() => setIsEditing(true)} className="text-white">
                            Edit Profile
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;
