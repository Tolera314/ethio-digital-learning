
import PageLayout from "../components/PageLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Book, GraduationCap, Users, Award, BookOpen } from "lucide-react";

const About = () => {
  return (
    <PageLayout 
      title="About Ethio Digital Academy"
      subtitle="Empowering Ethiopians through digital education"
      backgroundImage="/assets/library-bg.jpg"
    >
      <div className="space-y-8">
        {/* Mission Statement */}
        <section className="text-left">
          <h2 className="text-xl sm:text-2xl font-bold mb-3 text-white">Our Mission</h2>
          <p className="text-gray-200">
            Ethio Digital Academy is dedicated to providing accessible, high-quality digital education 
            to empower Ethiopian students and professionals. We believe in bridging the digital 
            divide and creating opportunities for all Ethiopians to participate in the global 
            digital economy.
          </p>
        </section>

        {/* Core Values */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
          <h2 className="text-xl sm:text-2xl font-bold mb-3 text-white md:col-span-2">Our Core Values</h2>
          
          <Card className="bg-black/30 border-purple-500/30 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="bg-purple-800/50 p-2 rounded-lg">
                  <GraduationCap className="text-purple-300" size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-purple-300">Excellence</h3>
                  <p className="text-gray-300 text-sm">We strive for excellence in all our educational offerings, ensuring content meets international standards.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/30 border-pink-500/30 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="bg-pink-800/50 p-2 rounded-lg">
                  <Users className="text-pink-300" size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-pink-300">Inclusivity</h3>
                  <p className="text-gray-300 text-sm">We create an inclusive learning environment accessible to students from all backgrounds and regions.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/30 border-blue-500/30 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="bg-blue-800/50 p-2 rounded-lg">
                  <Book className="text-blue-300" size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-blue-300">Innovation</h3>
                  <p className="text-gray-300 text-sm">We embrace innovative teaching methods and constantly update our curriculum to match industry developments.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/30 border-yellow-500/30 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="bg-yellow-800/50 p-2 rounded-lg">
                  <Award className="text-yellow-300" size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-yellow-300">Community</h3>
                  <p className="text-gray-300 text-sm">We foster a collaborative community where students support each other's growth and learning journey.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Programs Offered */}
        <section className="text-left">
          <h2 className="text-xl sm:text-2xl font-bold mb-3 text-white">Our Programs</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-200">
            <li>Comprehensive Digital Skills Certification</li>
            <li>Web Development and Design Courses</li>
            <li>Data Science and Analytics Programs</li>
            <li>Digital Marketing and Business Strategy</li>
            <li>Mobile App Development Training</li>
            <li>Artificial Intelligence and Machine Learning Courses</li>
          </ul>
        </section>

        {/* Contact Info */}
        <section className="text-left bg-black/30 p-4 rounded-lg">
          <h2 className="text-xl sm:text-2xl font-bold mb-3 text-white">Get in Touch</h2>
          <p className="text-gray-200">
            We're located in Addis Ababa, Ethiopia. For inquiries about our programs, 
            please visit our contact page or reach out to us at <span className="text-purple-300">info@ethiopdigitalacademy.com</span>
          </p>
        </section>
      </div>
    </PageLayout>
  );
};

export default About;
