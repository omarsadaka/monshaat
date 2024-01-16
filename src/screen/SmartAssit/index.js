import React, { useMemo, useRef, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { AppStyle } from '../../assets/style/AppStyle';
import NewHeader from '../../components/NewHeader';

const blueColor = '#3a4967';
const whiteBold = '#f3f7fa';
const grayText = '#b8bbbb';
const NewOrder = [
  {
    title: 'طلب جديد',
    acitons: [
      { name: 'عمل عن بعد', action: 'newRequest', postSelect: null },
      { name: 'الاجازه ', action: 'newRequest' },
      { name: 'مركز الطلبات والدعم', action: 'newRequest', postSelect: null },
      { name: 'تدريب', action: 'newRequest', postSelect: null },
      { name: 'استئذان', action: 'newRequest', postSelect: null },
      { name: 'طلب شراء', action: 'newRequest', postSelect: null },
      {
        name: 'روزنامة الدورات الداخلية',
        action: 'newRequest',
        postSelect: null,
      },
      { name: ' خطاب الموارد البشرية', action: 'newRequest', postSelect: null },
      { name: 'الانتداب', action: 'newRequest', postSelect: null },
    ],
    answers: [],
  },
];

const IntailQuestions = [
  {
    title: 'كيف أقدر أخدمك اليوم؟',
    acitons: [
      { name: 'طلب جديد', action: 'newRequest', postSelect: NewOrder[0] },
      { name: 'إستعلام عن طلب', action: 'newRequest', postSelect: null },
      { name: 'احتاج مساعدة', action: 'newRequest', postSelect: null },
    ],
    answers: [],
  },
];

const Help = [
  {
    title: 'احتاج مساعدة',
    actions: [{}],
  },
];

const SmartAssit = props => {
  const [questions, setQuestions] = useState(Array.from(IntailQuestions));
  const [date, setDate] = useState(new Date());
  const flatlistRef = useRef(null);

  const RenderQuestion = ({ question, index }) =>
    useMemo(() => {
      return (
        <React.Fragment>
          <View style={styles.questionSelect}>
            <View style={styles.borderWrapper}>
              <Text style={styles.questionSelectTitle}>{question.title}</Text>
            </View>
            <View style={styles.center}>
              {question.acitons.map((q, i) => {
                return (
                  <TouchableOpacity
                    onPress={() => {
                      let updateQuestion = questions;
                      updateQuestion[index].answers = [q.name];
                      q.postSelect && updateQuestion.push(q.postSelect);
                      setQuestions(updateQuestion);
                      setDate(new Date());
                      setTimeout(() => {
                        flatlistRef.current.scrollToEnd();
                        //  flatlistRef?.current?.scrollToEnd({animating: true});
                      }, 100);
                    }}
                    key={i}
                    style={styles.borderWrapper}
                  >
                    <Text style={styles.questionAnswerSelect}>{q.name}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
          <View>
            {question.answers.map((ans, index) => {
              return (
                <View key={index} style={styles.answers}>
                  <Text style={styles.answersText}>{ans}</Text>
                </View>
              );
            })}
          </View>
        </React.Fragment>
      );
    }, [questions]);

  const resetQuestions = React.useMemo(() => {
    return (
      <TouchableOpacity
        onPress={() => {
          setQuestions(
            IntailQuestions.map(q => {
              q.answers = [];
              return q;
            }),
          );
        }}
        style={styles.reloadQuestionWrapper}
      >
        <Text style={styles.reloadQuestionText}>البدء من جديد</Text>
        <AntDesign name="retweet" size={12} color={blueColor} />
      </TouchableOpacity>
    );
  }, []);

  const renderItem = ({ item, index }) => {
    if (index === 0) {
      return (
        <React.Fragment>
          <View style={styles.question}>
            <Text style={styles.questionText}>مساء الخير محمد</Text>
          </View>
          <View style={styles.question}>
            <Text style={styles.questionText}>مرحبا بك في تطبيق الموظفين </Text>
          </View>
          <RenderQuestion question={item} index={index} />
        </React.Fragment>
      );
    }
    return <RenderQuestion question={item} index={index} />;
  };
  return (
    <View
      style={[
        AppStyle.page,
        { flexDirection: 'column', backgroundColor: 'white' },
      ]}
    >
      <NewHeader {...props} back={true} title="الدعم الذكي" />
      <FlatList
        ref={flatlistRef}
        style={styles.flatList}
        ListHeaderComponent={resetQuestions}
        data={questions}
        keyExtractor={(item, i) => String(i)}
        renderItem={renderItem}
        contentContainerStyle={{
          paddingBottom: 300,
        }}
        onContentSizeChange={() => flatlistRef.current.scrollToEnd()}
        onLayout={() => flatlistRef.current.scrollToEnd()}
      />
    </View>
  );
};
export default SmartAssit;

const baseQuestionStyle = {
  borderRadius: 30,
  backgroundColor: whiteBold,
  marginVertical: 10,
  marginBottom: 3,
  maxWidth: '60%',
  alignSelf: 'flex-end',
  paddingVertical: 15,
  paddingHorizontal: 25,
};

const styles = StyleSheet.create({
  flatList: {
    marginHorizontal: 10,
  },
  question: {
    ...baseQuestionStyle,
  },
  questionText: {
    color: grayText,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 10,
  },
  reloadQuestionWrapper: {
    borderWidth: 1.2,
    borderColor: blueColor,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    width: 120,
    borderRadius: 20,
    padding: 8,
  },
  reloadQuestionText: {
    color: blueColor,
    fontSize: 12,
    marginHorizontal: 5,
  },
  questionSelect: {
    alignSelf: 'flex-end',
    backgroundColor: whiteBold,
    marginTop: 10,
    borderRadius: 20,
    paddingVertical: 20,
    // alignItems:'center',
    paddingHorizontal: 15,
  },
  borderWrapper: {
    borderBottomWidth: 0.17,
    borderBottomColor: grayText,
    paddingBottom: 5,
  },
  questionSelectTitle: {
    color: grayText,
    fontSize: 11,
    textAlign: 'center',
  },
  questionAnswerSelect: {
    color: blueColor,
    fontSize: 11,
    marginTop: 10,
    fontWeight: 'bold',
  },
  center: { justifyContent: 'center', alignItems: 'center' },
  answers: {
    ...baseQuestionStyle,
    backgroundColor: blueColor,
    alignSelf: 'flex-start',
    paddingVertical: 15,
    paddingHorizontal: 25,
  },
  answersText: {
    textAlign: 'center',
    color: 'white',
  },
});
